import React, {useState} from "react";
import {connect} from "react-redux";
import {Button, Modal, ModalBody} from "reactstrap";
import {AsyncTypeahead} from "react-bootstrap-typeahead";

import {MainLayout} from "../../layouts/Main";
import {
  initBuilder,
  searchArtistsByName,
  selectArtist,
  selectedArtistSelector,
} from "../../modules/artist";
import {signInWithFacebook} from "../../modules/auth";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF} from "@fortawesome/free-brands-svg-icons";
import laptop from "../../assets/img/photos/preview.gif";

const addArtistLink =
  "https://docs.google.com/forms/d/e/1FAIpQLSdyK3e1RwFQoisvMbxnTSw9Jc04H_qoFG73gGsvmF2JWwQWMA/viewform?usp=sf_link  ";

const mapState = state => ({
  selectedArtist: selectedArtistSelector(state),
});

const mapDispatch = {initBuilder, searchArtistsByName, selectArtist, signInWithFacebook};

const SelectArtist = ({
  history,
  initBuilder,
  selectedArtist,
  searchArtistsByName,
  selectArtist,
  signInWithFacebook,
}) => {
  const [state, setState] = useState({
    verificationModal: false,
    searching: false,
    options: [],
  });

  function toggleModal() {
    setState({...state, verificationModal: !state.verificationModal});
  }

  async function handleSearch(search) {
    setState({...state, searching: true});
    const {
      value: {data},
    } = await searchArtistsByName(search);

    const options = data.results.map(artist => ({
      ...artist,
      label: artist.name,
    }));
    setState({...state, searching: false, options});
  }

  async function handleSelectArtist(selectedArtists) {
    if (selectedArtists.length > 0) {
      selectArtist(selectedArtists[0]);
    }
  }

  function handleGetStarted() {
    if (process.env.REACT_APP_ENV === "production") {
      toggleModal();
    } else {
      initBuilder();
      setTimeout(() => {
        history.push("/social");
      }, 0);
    }
  }

  function handleVerifyWithFacebook() {
    window.FB.login(
      async response => {
        await signInWithFacebook(response.authResponse.accessToken);
        initBuilder();
        setTimeout(() => {
          history.push("/social");
        }, 0);
        // window.FB.api(`/${response.authResponse.userId}`, function (response) {
        //   console.log('sff', response)
        // })
        // window.FB.api("/me/accounts", function(res) {
        //   console.log("sss", res);
        // });
      },
      {scope: "pages_show_list,email"}
    );
  }

  return (
    <MainLayout>
      <div className="content-body">
        <div className="title">Build Your Own Artist Website in 5 Minutes</div>
        <div className="sub-title">Find Yourself on JamFeed</div>
        <div className="d-flex-row flex-wrap">
          <AsyncTypeahead
            id="search-artist"
            className="band-name mb-3"
            options={state.options}
            isLoading={state.searching}
            minLength={3}
            onSearch={handleSearch}
            onChange={handleSelectArtist}
            placeholder="Enter your artist or band name"
          />
          <Button
            color="success"
            className="btn-pill big-btn mb-3"
            onClick={handleGetStarted}
            disabled={!Boolean(selectedArtist)}
          >
            GET STARTED
          </Button>
        </div>
        <div className="d-flex-row flex-wrap">
          <span className="can-t-find">
            Can’t find your artist or band name on JamFeed?
          </span>
          <Button color="link" className="add-it" href={addArtistLink} target="_blank">
            Add it here!
          </Button>
        </div>
        <div className="d-flex-row imgs">
          <img src={laptop} className="laptop-img" alt="" />
        </div>
        <div className="d-flex-row">
          <a
            className="privacy-policy"
            href="http://jamfeed.com/PrivacyPolicy.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <a
            className="terms-of-service"
            href="http://jamfeed.com/TermsOfService.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
        </div>
        <Modal
          isOpen={state.verificationModal}
          toggle={toggleModal}
          className="verification-modal"
          centered
          size="lg"
        >
          <ModalBody>
            <div className="verification-modal--container">
              <div className="header">Verify Your Artist Page for Your Website</div>
              <div className="d-flex align-items-center mb-30px mt-30px">
                <img
                  src={selectedArtist ? selectedArtist.pictureurl : ""}
                  alt=""
                  width={100}
                />
                <div className="ml-sm">{selectedArtist ? selectedArtist.name : ""}</div>
              </div>
              <p className="content">
                Get verified immediately by logging into your Facebook account.
              </p>
              <button className="d-block facebook-btn" onClick={handleVerifyWithFacebook}>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faFacebookF} />
                  Verify with facebook
                </div>
              </button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default connect(mapState, mapDispatch)(SelectArtist);
