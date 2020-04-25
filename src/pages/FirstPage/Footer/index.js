import React from "react";

import {Wrapper, Subtitle, Link, LinkWrapper, Img, ExternalLink} from "./styles";
import logoImg from "../../../assets/images/logo.png";

const Footer = () => (
  <Wrapper>
    <Img src={logoImg} alt="Logo" />
    <Subtitle>Build your own automated website for free in less than 1 minute.</Subtitle>
    <Link href="/">GET STARTED</Link>

    <LinkWrapper>
      <ExternalLink
        href="http://jamfeed.com/TermsOfService.pdf"
        target="_blank"
        rel="noopener noreferrer"
        style={{borderRight: "1px solid white"}}
      >
        Terms of Service
      </ExternalLink>
      <ExternalLink
        href="http://jamfeed.com/PrivacyPolicy.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </ExternalLink>
    </LinkWrapper>
  </Wrapper>
);

export default Footer;
