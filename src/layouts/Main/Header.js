import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {AppNavbarBrand} from "@coreui/react";
import {Button} from "reactstrap";

import {selectedArtistSelector} from "../../modules/artist";

import logo from "../../assets/img/brand/logo.png";

const mapState = state => ({
  selectedArtist: selectedArtistSelector(state),
});

function Header({history, selectedArtist}) {
  const showGetStarted = window.location.pathname === "/";

  function handleGetStarted() {
    history.push("/social");
  }

  return (
    <React.Fragment>
      <div className="logo">
        <AppNavbarBrand full={{src: logo, alt: "JamFeed Logo"}} />
        <div className="logo-title d-none d-md-inline-block">FOR ARTISTS</div>
      </div>
      {showGetStarted && (
        <Button
          color="success"
          className="btn-pill get-start d-none d-md-inline-block"
          onClick={handleGetStarted}
          disabled={!Boolean(selectedArtist)}
        >
          GET STARTED
        </Button>
      )}
    </React.Fragment>
  );
}

export default withRouter(connect(mapState)(Header));
