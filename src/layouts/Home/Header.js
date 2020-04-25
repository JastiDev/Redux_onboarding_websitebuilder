import React from "react";
import {AppNavbarBrand} from "@coreui/react";
import logo from "../../assets/img/brand/logo.png";

function Header() {
  return (
    <div className="logo">
      <AppNavbarBrand full={{src: logo, alt: "JamFeed Logo"}} />
      <div className="logo-title d-none d-md-inline-block">FOR ARTISTS</div>
    </div>
  );
}

export default Header;
