import React from "react";
import {connect} from "react-redux";
import {Route, Redirect} from "react-router";
import Loader from "./Loader";
import {verifyToken, userSessionSelector} from "../modules/auth";

function ProtectedRoute({userSession, component: Component, ...restProps}) {
  const token = userSession.jwt;

  return (
    <Route
      {...restProps}
      render={props =>
        token ? (
          <Loader
            action={verifyToken}
            selector={userSessionSelector}
            triggerAction
            triggerPolicy={{
              triggerOnlyOnce: true,
            }}
          >
            {userSession => {
              if (userSession.valid) {
                return <Component {...props} />;
              } else {
                localStorage.removeItem("jamfeed-jwt");
                return (
                  <Redirect
                    to={{
                      pathname:
                        process.env.REACT_APP_ENV === "production" ? "/" : "/login",
                      state: {from: props.location},
                    }}
                  />
                );
              }
            }}
          </Loader>
        ) : (
          <Redirect
            to={{
              pathname: process.env.REACT_APP_ENV === "production" ? "/" : "/login",
              state: {from: props.location},
            }}
          />
        )
      }
    />
  );
}

const mapState = state => ({
  userSession: userSessionSelector(state),
});
export default connect(mapState)(ProtectedRoute);
