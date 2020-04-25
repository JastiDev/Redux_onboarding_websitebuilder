import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import {Button, Modal, ModalBody, ModalHeader, Input} from "reactstrap";
import Storage from "@aws-amplify/storage";
import FsLightbox from "fslightbox-react";

import {PhotoCropper, BandInfo, ConfirmationPopup} from "../../components";
import {
  selectedArtistSelector,
  webBuilderSelector,
  websiteCoverSelector,
  getWebBuilder,
  getWebsiteCover,
  updateWebsiteCover,
} from "../../modules/artist";
import {SetS3Config} from "../../configureAmplify";

import laptopImage from "../../assets/img/photos/laptop.png";

const mapStateToProps = state => ({
  selectedArtist: selectedArtistSelector(state),
  webBuilder: webBuilderSelector(state),
  websiteCover: websiteCoverSelector(state),
});

const mapDispatch = {
  getWebBuilder,
  getWebsiteCover,
  updateWebsiteCover,
};

function CoverSocialHome({
  history,
  selectedArtist,
  webBuilder,
  websiteCover,
  getWebBuilder,
  getWebsiteCover,
  updateWebsiteCover,
}) {
  const [videoUrlDialogOpen, toggleVideoUrlDialog] = useState(false);
  const [mountLightbox, setMountLightBox] = useState(false);
  const [videoToPreview, setVideoToPreview] = useState(null);
  const [photoCropperOpen, setPhotoCropperOpen] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState({
    isOpen: false,
    message: "",
  });
  const [desktopVideo, setDesktopVideo] = useState({
    thumbUrl: "",
    url: "",
  });
  const [artistBioPhotoUrl, setArtistBioPhotoUrl] = useState("");
  const [tempVideoUrl, setTempVideoUrl] = useState("");

  useEffect(() => {
    if (!webBuilder.id) {
      getWebBuilder(selectedArtist.id);
    }
  }, [webBuilder, getWebBuilder, selectedArtist]);

  useEffect(() => {
    if (webBuilder.id && !websiteCover.id) {
      getWebsiteCover(webBuilder.id);
    }
  }, [getWebsiteCover, webBuilder, websiteCover]);

  useEffect(() => {
    if (websiteCover.id) {
      setDesktopVideo({url: websiteCover.desktop_video_url || ""});
      setArtistBioPhotoUrl(websiteCover.artist_bio_photo_url || "");
    }
  }, [websiteCover]);

  useEffect(() => {
    async function asyncFunc() {
      const videoId = desktopVideo.url.replace("https://www.youtube.com/watch?v=", "");
      const res = await window.gapi.client.youtube.videos.list({
        part: "snippet",
        id: videoId,
      });
      const video = res.result.items[0];
      if (video) {
        setDesktopVideo({
          url: desktopVideo.url,
          thumbUrl: video.snippet.thumbnails.medium.url,
        });
      }
    }

    asyncFunc();
  }, [desktopVideo]);

  function handleAddDesktopVideo() {
    setTempVideoUrl(desktopVideo.url);
    toggleVideoUrlDialog(true);
  }

  function handleAddPhoto() {
    setPhotoCropperOpen(true);
  }

  function handleClosePhotoCropper() {
    setPhotoCropperOpen(false);
  }

  function handleChangeVideoUrl(e) {
    setTempVideoUrl(e.target.value);
  }

  async function handleAddVideoUrl() {
    toggleVideoUrlDialog(false);
    await updateWebsiteCover({
      ...websiteCover,
      desktop_video_url: tempVideoUrl,
    });
    setConfirmationPopup({
      isOpen: true,
      message: "You've successfully added the desktop video",
    });
  }

  function handleUploadPhoto(imageFile) {
    const imageName = `artist-bio-photo-${Date.now()}.png`;
    SetS3Config(process.env.REACT_APP_Bucket_name, "public");
    Storage.put(imageName, imageFile, {
      contentType: imageFile.type,
      ACL: "public-read",
    })
      .then(() => {
        const url = `https://${process.env.REACT_APP_Bucket_name}.s3.amazonaws.com/public/${imageName}`;
        setArtistBioPhotoUrl(url);
        setPhotoCropperOpen(false);
        setConfirmationPopup({
          isOpen: true,
          message: "You've successfully uploaded a photo",
        });
        updateWebsiteCover({
          ...websiteCover,
          artist_bio_photo_url: url,
        });
      })
      .catch(e => {
        console.log("error upload", e);
        setConfirmationPopup({
          message: "The photo could not be uploaded. Please try again later",
          isOpen: true,
        });
      });
  }

  function showVideo(videoUrl) {
    return () => {
      setMountLightBox(true);
      setTimeout(() => {
        setVideoToPreview(videoUrl);
      }, 100);
    };
  }

  return (
    <div className="content-body">
      <div className="title">
        Add your website cover photos and your artist / band bio
      </div>
      <div className="artist-band">
        <div className="artist-media-items">
          <div className="artist-item desktop-video">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={desktopVideo.thumbUrl || laptopImage}
                  alt=""
                  className="laptop"
                />
                {desktopVideo.thumbUrl ? (
                  <div
                    className="play-button"
                    onClick={showVideo(desktopVideo.url)}
                  ></div>
                ) : (
                  <div className="play-button-static" />
                )}
              </div>
              <div className="artist-title">Desktop Video</div>
              <div className="artist-sub-title">(YouTube URL)</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddDesktopVideo}
            >
              {desktopVideo.url ? "Change Video" : "Add Video"}
            </Button>
          </div>
          <div className="artist-item bio-photo">
            <div className="item-content">
              <div className="image-content">
                <img src={artistBioPhotoUrl || laptopImage} alt="" className="laptop" />
              </div>
              <div className="artist-title">Artist Bio Photo</div>
              <div className="artist-sub-title">(Square Image)</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddPhoto}
            >
              {artistBioPhotoUrl ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
        </div>
        <BandInfo />
      </div>
      <div className="d-flex-row continu-btn">
        <Button
          color="success"
          outline
          className="btn-pill big-btn height-35px m-2"
          onClick={() => history.push("/template")}
        >
          Back
        </Button>
        <Button
          color="success"
          className="btn-pill big-btn height-35px m-2"
          disabled={!desktopVideo.url || !artistBioPhotoUrl}
          onClick={() => history.push("/integration")}
        >
          Continue
        </Button>
      </div>
      <Modal
        className="modal-dialog"
        centered
        isOpen={videoUrlDialogOpen}
        toggle={() => toggleVideoUrlDialog(false)}
      >
        <ModalHeader>Enter the desktop video URL</ModalHeader>
        <ModalBody>
          <Input
            className="input-box"
            value={tempVideoUrl}
            onChange={handleChangeVideoUrl}
          />
        </ModalBody>
        <Button
          color="dark"
          outline
          className="btn-pill artist-btn"
          onClick={handleAddVideoUrl}
        >
          Add
        </Button>
      </Modal>
      <PhotoCropper
        isOpen={photoCropperOpen}
        aspectRatio={1}
        onRequestClose={handleClosePhotoCropper}
        onAdd={handleUploadPhoto}
      />
      {mountLightbox && (
        <FsLightbox
          toggler={Boolean(videoToPreview)}
          sources={[videoToPreview]}
          type="youtube"
          onClose={() => {
            setVideoToPreview(null);
            setMountLightBox(false);
          }}
        />
      )}
      <ConfirmationPopup
        open={confirmationPopup.isOpen}
        onRequestClose={() => setConfirmationPopup({isOpen: false})}
        message={confirmationPopup.message}
      />
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatch
)(CoverSocialHome);
