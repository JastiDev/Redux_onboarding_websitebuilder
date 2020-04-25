import React, {useState} from "react";
import {connect} from "react-redux";

import {Container, Background} from "./styles";
import Header from "./Header";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Footer from "./Footer";

import LoadingOverlay from "react-loading-overlay";
import {signIn, signUp, signInWithFacebook} from "../../modules/auth";
import "react-toastify/dist/ReactToastify.css";

const mapState = state => ({});
const mapDispatch = {
  signIn,
  signUp,
};

const FirstPage = ({history, signIn, signUp}) => {
  const [isBusy, setIsBusy] = useState(false);

  const handleSubmit = async values => {
    setIsBusy(true);
    try {
      // await signUp(values);
      await signIn(values);
      setTimeout(() => {
        history.push("/artist");
      }, 100);
    } catch (err) {
      console.log(err);
    }
    setIsBusy(false);
  };

  const handleVerifyWithFacebook = () => {
    window.FB.login(
      async response => {
        setIsBusy(true);
        try {
          await signInWithFacebook(response.authResponse.accessToken);
          setTimeout(() => {
            history.push("/artist");
          }, 100);
        } catch (err) {
          console.log(err);
        }
        setIsBusy(false);
      },
      {scope: "pages_show_list,email"}
    );
  };

  return (
    <Container>
      <Background />
      <LoadingOverlay active={isBusy} spinner>
        <Header />
        <Section1
          propSubmit={handleSubmit}
          propVerifyWithFacebook={handleVerifyWithFacebook}
        />
      </LoadingOverlay>

      <Section2 />
      <Section3 />
      <Section4 />
      <Footer />
    </Container>
  );
};

export default connect(mapState, mapDispatch)(FirstPage);
