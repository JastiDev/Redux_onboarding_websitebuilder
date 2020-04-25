import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import {Button} from "reactstrap";
import Storage from "@aws-amplify/storage";

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

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 1024;

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
  const [confirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [state, setState] = useState({
    home_page_photo_url: "",
    news_page_photo_url: "",
    tour_page_photo_url: "",
    music_page_photo_url: "",
    video_page_photo_url: "",
    merch_page_photo_url: "",
    about_page_photo_url: "",
    contact_page_photo_url: "",
    photoCropperOpen: false,
    bio: "",
  });

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
      setState({
        home_page_photo_url: websiteCover.home_page_photo_url,
        news_page_photo_url: websiteCover.news_page_photo_url,
        tour_page_photo_url: websiteCover.tour_page_photo_url,
        music_page_photo_url: websiteCover.music_page_photo_url,
        video_page_photo_url: websiteCover.video_page_photo_url,
        merch_page_photo_url: websiteCover.merch_page_photo_url,
        about_page_photo_url: websiteCover.about_page_photo_url,
        contact_page_photo_url: websiteCover.contact_page_photo_url,
      });
    }
  }, [websiteCover]);

  function handleAddPhoto(photoType) {
    return () => {
      setState({
        ...state,
        photoCropperOpen: true,
        photoType,
      });
    };
  }

  function handleClosePhotoCropper() {
    setState({
      ...state,
      photoCropperOpen: false,
    });
  }

  function handleUploadPhoto(imageFile) {
    const {photoType} = state;
    const imageName = `${photoType}-${Date.now()}.png`;
    SetS3Config(process.env.REACT_APP_Bucket_name, "public");
    Storage.put(imageName, imageFile, {
      contentType: imageFile.type,
      ACL: "public-read",
    })
      .then(() => {
        const url = `https://${process.env.REACT_APP_Bucket_name}.s3.amazonaws.com/public/${imageName}`;
        setState({
          ...state,
          [photoType]: url,
          photoCropperOpen: false,
        });
        setConfirmationMessage("You've successfully uploaded a photo");
        setConfirmationPopupOpen(true);
        updateWebsiteCover({
          ...websiteCover,
          [photoType]: url,
        });
      })
      .catch(e => {
        console.log("error upload", e);
        setConfirmationMessage("The photo could not be uploaded. Please try again later");
        setConfirmationPopupOpen(true);
      });
  }

  return (
    <div className="content-body">
      <div className="title">
        Add your website cover photos and your artist / band bio
      </div>
      <div className="artist-band">
        <div className="artist-item-group">
          <div className="artist-item">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={state.home_page_photo_url || laptopImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">Home Page</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddPhoto("home_page_photo_url")}
            >
              {state["home_page_photo_url"] ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
          <div className="artist-item">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={state.news_page_photo_url || laptopImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">News Page</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddPhoto("news_page_photo_url")}
            >
              {state["news_page_photo_url"] ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
          <div className="artist-item">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={state.tour_page_photo_url || laptopImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">Tour Page</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddPhoto("tour_page_photo_url")}
            >
              {state["tour_page_photo_url"] ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
          <div className="artist-item">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={state.music_page_photo_url || laptopImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">Music Page</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddPhoto("music_page_photo_url")}
            >
              {state["music_page_photo_url"] ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
          <div className="artist-item">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={state.video_page_photo_url || laptopImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">Video Page</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddPhoto("video_page_photo_url")}
            >
              {state["video_page_photo_url"] ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
          <div className="artist-item">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={state.merch_page_photo_url || laptopImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">Merch Page</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddPhoto("merch_page_photo_url")}
            >
              {state["merch_page_photo_url"] ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
          <div className="artist-item">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={state.about_page_photo_url || laptopImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">About Page</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddPhoto("about_page_photo_url")}
            >
              {state["about_page_photo_url"] ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
          <div className="artist-item">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={state.contact_page_photo_url || laptopImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">Contact Page</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddPhoto("contact_page_photo_url")}
            >
              {state["contact_page_photo_url"] ? "Change Photo" : "Add Photo"}
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
          disabled={
            !state["home_page_photo_url"] ||
            !state["news_page_photo_url"] ||
            !state["tour_page_photo_url"] ||
            !state["music_page_photo_url"] ||
            !state["video_page_photo_url"] ||
            !state["merch_page_photo_url"] ||
            !state["about_page_photo_url"] ||
            !state["contact_page_photo_url"]
          }
          onClick={() => history.push("/integration")}
        >
          Continue
        </Button>
      </div>
      <PhotoCropper
        isOpen={state.photoCropperOpen}
        aspectRatio={DESKTOP_WIDTH / DESKTOP_HEIGHT}
        onRequestClose={handleClosePhotoCropper}
        onAdd={handleUploadPhoto}
      />
      <ConfirmationPopup
        open={confirmationPopupOpen}
        onRequestClose={() => setConfirmationPopupOpen(false)}
        message={confirmationMessage}
      />
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatch
)(CoverSocialHome);
