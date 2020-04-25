import React, {useState} from "react";
import {connect} from "react-redux";
import {Input} from "reactstrap";

import {addWebsiteUrl, selectedArtistSelector} from "../../modules/artist";

import {Container, Background, Link} from "./styles.js";
import logoImg from "../../assets/images/logo.png";
import LoadingOverlay from "react-loading-overlay";

const mapState = state => ({
  selectedArtist: selectedArtistSelector(state),
});

const mapDispatch = {
  addWebsiteUrl,
};

const AddWebsiteUrl = ({history, selectedArtist, addWebsiteUrl}) => {
  const [state, setState] = useState({
    isBusy: false,
    options: [],
    websiteurl: "",
  });

  async function handleContinue(e) {
    if (process.env.REACT_APP_ENV === "production") {
      setState({isBusy: true});
      await addWebsiteUrl(selectedArtist.id, state.websiteurl);
      setState({isBusy: false});
      setTimeout(() => {
        history.push("/social");
      }, 0);
    } else {
      setState({isBusy: true});
      await addWebsiteUrl(selectedArtist.id, state.websiteurl);
      setState({isBusy: false});
      setTimeout(() => {
        history.push("/social");
      }, 0);
    }
  }

  function onChangeWebsiteUrl(e) {
    setState({...state, websiteurl: e.target.value});
  }

  return (
    <Container>
      <Background />
      <LoadingOverlay active={state.isBusy} spinner>
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
          <div className="title">Enter Your Artist or Band Website URL</div>

          <Input
            value={state.websiteurl}
            onChange={onChangeWebsiteUrl}
            style={{width: "60%", maxWidth: "500px", margin: "30px"}}
            placeholder="www.artistname.com"
          />

          <Link href="/" onClick={handleContinue} disabled={state.websiteurl === ""}>
            Continue
          </Link>
        </div>
      </LoadingOverlay>
    </Container>
  );
};

export default connect(mapState, mapDispatch)(AddWebsiteUrl);
