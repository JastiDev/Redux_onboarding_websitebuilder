import React, {useState} from "react";
import {connect} from "react-redux";
import {Input, Button, Modal, ModalBody} from "reactstrap";
import {AsyncTypeahead} from "react-bootstrap-typeahead";

import {
  initBuilder,
  createArtisitBySpotify,
  searchArtistsByName,
  selectArtist,
  selectedArtistSelector,
} from "../../modules/artist";

import {Container, Background, Link} from "./styles.js";
import logoImg from "../../assets/images/logo.png";
import LoadingOverlay from "react-loading-overlay";

const mapState = state => ({
  selectedArtist: selectedArtistSelector(state),
});

const mapDispatch = {
  initBuilder,
  createArtisitBySpotify,
  searchArtistsByName,
  selectArtist,
};

const SelectArtist = ({
  history,
  selectedArtist,
  initBuilder,
  createArtisitBySpotify,
  searchArtistsByName,
  selectArtist,
}) => {
  const [state, setState] = useState({
    isBusy: false,
    isModal: false,
    searching: false,
    options: [],
    urlArtistBySpotify: "",
  });

  function toggleModal() {
    setState({...state, isModal: !state.isModal});
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
      initBuilder();
      setTimeout(() => {
        history.push("/addwebsiteurl");
      }, 0);
    } else {
      initBuilder();
      setTimeout(() => {
        history.push("/addwebsiteurl");
      }, 0);
    }
  }

  async function addArtist(e) {
    setState({isBusy: true});
    await createArtisitBySpotify(state.urlArtistBySpotify);
    setState({isBusy: false});

    setTimeout(() => {
      toggleModal();
      initBuilder();
      history.push("/addwebsiteurl");
    }, 0);
  }

  function onChangeUrlArtistBySpotify(e) {
    setState({...state, urlArtistBySpotify: e.target.value});
  }

  return (
    <Container>
      <LoadingOverlay active={state.isBusy} spinner>
        <Background />
        <div className="content-body">
          <img
            src={logoImg}
            alt="Logo"
            style={{
              marginTop: "150px",
              marginBottom: "40px",
              maxWidth: "216px",
              width: "100%",
            }}
          />
          <div className="title">A Music Website That Works For You</div>
          <div className="sub-title">
            Build your new automated music website in a few minutes for free! No credit
            card required.
          </div>
          <div className="d-flex-row flex-wrap">
            <AsyncTypeahead
              id="search-artist"
              className="band-name mb-3"
              options={state.options}
              isLoading={state.searching}
              minLength={3}
              onSearch={handleSearch}
              onChange={handleSelectArtist}
              placeholder="Search artist or band name"
            />
          </div>
          <div className="d-flex-row flex-wrap">
            <span className="can-t-find">
              Can’t find your artist or band name on JamFeed?
            </span>
            <Button
              color="link"
              className="add-it"
              target="_blank"
              onClick={e => toggleModal()}
            >
              Add it here!
            </Button>
          </div>

          <Link href="/" onClick={handleGetStarted} disabled={!Boolean(selectedArtist)}>
            Continue
          </Link>

          <Modal
            isOpen={state.isModal}
            toggle={toggleModal}
            className="verification-modal"
            centered
            size="lg"
          >
            <ModalBody>
              <div className="verification-modal--container">
                <div className="header" style={{marginTop: "50px"}}>
                  Copy and paste your Spotify URL to add your artist/band to JamFeed.
                </div>
                <Input
                  style={{width: "60%", margin: "50px"}}
                  placeholder="Ex: https://open.spotify.com/artist/2deuprRz9fqMiBfTV6CAo5"
                  value={state.urlArtistBySpotify}
                  onChange={onChangeUrlArtistBySpotify}
                />
                <Link
                  onClick={addArtist}
                  disabled={!Boolean(selectedArtist)}
                  style={{marginBottom: "50px"}}
                >
                  Add to JamFeed
                </Link>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </LoadingOverlay>
    </Container>
  );
};

export default connect(mapState, mapDispatch)(SelectArtist);
