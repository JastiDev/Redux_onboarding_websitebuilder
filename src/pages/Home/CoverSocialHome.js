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

import phoneImage from "../../assets/img/photos/phone.png";
import laptopImage from "../../assets/img/photos/laptop.png";

const MOB_WIDTH = 320;
const MOB_HEIGHT = 320;
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
    desktop_video_url: "",
    artist_bio_photo_url: "",
    photoCropperOpen: false,
    photoWidth: MOB_WIDTH,
    photoHeight: MOB_HEIGHT,
    confirmationMessage: "",
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
        mobile_photo_url: websiteCover.mobile_photo_url,
        desktop_photo_url: websiteCover.desktop_photo_url,
      });
    }
  }, [websiteCover]);

  function handleAddMobilePhoto() {
    setState({
      ...state,
      photoWidth: MOB_WIDTH,
      photoHeight: MOB_HEIGHT,
      photoCropperOpen: true,
    });
  }

  function handleAddDesktopPhoto() {
    setState({
      ...state,
      photoWidth: DESKTOP_WIDTH,
      photoHeight: DESKTOP_HEIGHT,
      photoCropperOpen: true,
    });
  }

  function handleClosePhotoCropper() {
    setState({
      ...state,
      photoCropperOpen: false,
    });
  }

  function handleUploadPhoto(imageFile) {
    const device = state.photoWidth === MOB_WIDTH ? "mobile" : "desktop";
    const imageName = `${device}-Photo-${Date.now()}.png`;
    SetS3Config(process.env.REACT_APP_Bucket_name, "public");
    Storage.put(imageName, imageFile, {
      contentType: imageFile.type,
      ACL: "public-read",
    })
      .then(() => {
        const url = `https://${process.env.REACT_APP_Bucket_name}.s3.amazonaws.com/public/${imageName}`;

        setState({
          ...state,
          [`${device}_photo_url`]: url,
          photoCropperOpen: false,
        });
        setConfirmationMessage("You've successfully uploaded a photo");
        setConfirmationPopupOpen(true);
        updateWebsiteCover({
          ...websiteCover,
          [`${device}_photo_url`]: url,
        });
      })
      .catch(e => {
        console.log("error upload", e);
        setConfirmationMessage("The photo could not be uploaded. Please try again later");
        setConfirmationPopupOpen(true);
      });
  }

  console.log("[SocialHome] Render");
  return (
    <div className="content-body">
      <div className="title">
        Add your website cover photos and your artist / band bio
      </div>
      <div className="artist-band">
        <div className="artist-media-items">
          <div className="artist-item mobile-photo">
            <div className="item-content mobile">
              <div className="image-content">
                <img
                  src={state.mobile_photo_url || phoneImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">Mobile</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddMobilePhoto}
            >
              {state["mobile_photo_url"] ? "Change Photo" : "Add Photo"}
            </Button>
          </div>
          <div className="artist-item desktop-photo">
            <div className="item-content">
              <div className="image-content">
                <img
                  src={state.desktop_photo_url || laptopImage}
                  alt=""
                  className="laptop"
                />
              </div>
              <div className="artist-title">Desktop</div>
            </div>
            <Button
              color="dark"
              outline
              className="btn-pill artist-btn"
              onClick={handleAddDesktopPhoto}
            >
              {state["desktop_photo_url"] ? "Change Photo" : "Add Photo"}
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
          disabled={!state["mobile_photo_url"] || !state["desktop_photo_url"]}
          onClick={() => history.push("/integration")}
        >
          Continue
        </Button>
      </div>
      <PhotoCropper
        isOpen={state.photoCropperOpen}
        aspectRatio={state.photoWidth / state.photoHeight}
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
