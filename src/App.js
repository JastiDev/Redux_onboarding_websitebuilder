import React, {useEffect} from "react";
import {BrowserRouter as Router, Switch} from "react-router-dom";

import {withHomeLayout, withMainLayout} from "./layouts";
import {
  ConfirmAccounts,
  CoverVideoHome,
  CoverSocialHome,
  CoverPhotoHome,
  ChooseTheme,
  SubscribeEmail,
  Integration,
  Finish,
  SignIn,
} from "./pages";
import FirstPage from "./pages/FirstPage";
import SelectArtist from "./pages/SecondPage/SelectArtist";
import {ProtectedRoute, PublicRoute, ScrollToTop} from "./components";

import "./App.scss";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";
import "react-image-crop/dist/ReactCrop.css";
import AddWebsiteUrl from "./pages/ThirdPage/AddWebsiteUrl";

function App() {
  useEffect(() => {
    function onGapiLoaded() {
      window.gapi.client.setApiKey("AIzaSyBo9BkFJfO9UOHOoFXsMu0-2EoUInRS6Ko");
      window.gapi.client.load("youtube", "v3", function() {
        // console.log("yt api loaded");
      });
    }

    window.gapi.load("client", onGapiLoaded);
  }, []);

  if (process.env.REACT_APP_ENV === "production") {
    return (
      <Router>
        <ScrollToTop />
        <Switch>
          <ProtectedRoute path="/artist" exact component={SelectArtist} />
          <ProtectedRoute path="/addwebsiteurl" exact component={AddWebsiteUrl} />
          <ProtectedRoute
            path="/social"
            exact
            component={withMainLayout(ConfirmAccounts)}
          />
          <ProtectedRoute
            path="/template"
            exact
            component={withMainLayout(ChooseTheme)}
          />
          <ProtectedRoute
            path="/cover/video_home"
            exact
            component={withMainLayout(CoverVideoHome)}
          />
          <ProtectedRoute
            path="/cover/social_home"
            exact
            component={withMainLayout(CoverSocialHome)}
          />
          <ProtectedRoute
            path="/cover/photo_home"
            exact
            component={withMainLayout(CoverPhotoHome)}
          />
          <ProtectedRoute
            path="/integration"
            exact
            component={withMainLayout(Integration)}
          />
          <ProtectedRoute
            path="/subscribe"
            exact
            component={withMainLayout(SubscribeEmail)}
          />
          <ProtectedRoute path="/finish" exact component={withMainLayout(Finish)} />
          <PublicRoute path="/" component={FirstPage} />
        </Switch>
      </Router>
    );
  } else {
    return (
      <Router>
        <ScrollToTop />
        <Switch>
          <ProtectedRoute path="/" exact component={SelectArtist} />
          <ProtectedRoute
            path="/social"
            exact
            component={withMainLayout(ConfirmAccounts)}
          />
          <ProtectedRoute
            path="/template"
            exact
            component={withMainLayout(ChooseTheme)}
          />
          <ProtectedRoute
            path="/cover/video_home"
            exact
            component={withMainLayout(CoverVideoHome)}
          />
          <ProtectedRoute
            path="/cover/social_home"
            exact
            component={withMainLayout(CoverSocialHome)}
          />
          <ProtectedRoute
            path="/cover/photo_home"
            exact
            component={withMainLayout(CoverPhotoHome)}
          />
          <ProtectedRoute
            path="/integration"
            exact
            component={withMainLayout(Integration)}
          />
          <ProtectedRoute
            path="/subscribe"
            exact
            component={withMainLayout(SubscribeEmail)}
          />
          <ProtectedRoute path="/finish" exact component={withMainLayout(Finish)} />
          <PublicRoute path="/login" exact component={withHomeLayout(SignIn)} />
          {/* <PublicRoute path="/register" exact component={withHomeLayout(SignUp)} /> */}
        </Switch>
      </Router>
    );
  }
}

export default App;
