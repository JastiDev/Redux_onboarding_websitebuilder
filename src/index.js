import "react-app-polyfill/ie9"; // For IE 9-11 support
import "react-app-polyfill/stable";
// import 'react-app-polyfill/ie11'; // For IE 11 support
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";

import {initialState as artistInitialState} from "./modules/artist";
import createStore from "./store/createStore";
import * as serviceWorker from "./serviceWorker";

import {configureAmplify} from "./configureAmplify";

configureAmplify();

const initialState = {
  auth: {
    session: {
      jwt: localStorage.getItem("jamfeed-jwt"),
      valid: false,
    },
  },
  artist: {
    ...artistInitialState,
    selected: JSON.parse(localStorage.getItem("jamfeed-selected-artist")),
  },
};
const store = createStore(initialState);

// =========================================
// Render
// =========================================
const composeApp = App => (
  <Provider store={store}>
    <App />
  </Provider>
);

const renderApp = () => {
  const App = require("./App").default;
  ReactDOM.render(composeApp(App), document.getElementById("root"));
};

renderApp();

if (module.hot) {
  module.hot.accept("./App", renderApp);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
