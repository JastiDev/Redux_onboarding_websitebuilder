import {createAction, handleActions, combineActions} from "redux-actions";
import {createSelector} from "reselect";
import {Auth} from "aws-amplify";

import {request} from "../helpers/http";
import {SIGNUP, LOGIN, VERIFY_TOKEN, LOGIN_WITH_FACEBOOK} from "./actions";
import {fulfilled} from "../helpers";

// ==================================
// Selectors
// ==================================
export const userSessionSelector = createSelector(
  state => state.auth,
  auth => auth.session
);

// ==================================
// Actions
// ==================================
export const signUp = createAction(SIGNUP, async credential => {
  const {firstname, email, password} = credential;
  const phone_number = "";
  try {
    await Auth.signUp({username: firstname, password, attributes: {email, phone_number}});
  } catch (error) {
    console.log(error);
  }
});

export const signIn = createAction(LOGIN, async credential => {
  const {email, password} = credential;
  try {
    const user = await Auth.signIn(email, password);

    const accessToken = user.signInUserSession.accessToken.jwtToken;

    return request({
      url: "/auth/cognitoAuth",
      method: "post",
      body: {
        accessToken,
      },
    });
  } catch (error) {
    throw error;
  }
});

export const signInWithFacebook = createAction(LOGIN_WITH_FACEBOOK, async fbToken => {
  return request({
    url: "/auth/facebookAuth",
    method: "post",
    body: {
      fbToken,
    },
  });
});

export const verifyToken = createAction(VERIFY_TOKEN, () => (_, getState) => {
  const session = userSessionSelector(getState()) || {};

  return request({
    url: "/auth/validate",
    method: "post",
    body: {
      token: session.jwt,
    },
  });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [combineActions(fulfilled(signIn), fulfilled(signInWithFacebook))]: (state, action) => {
    const {token} = action.payload.data;

    localStorage.setItem("jamfeed-jwt", token);
    return {
      ...state,
      session: {
        jwt: token,
        valid: true,
      },
    };
  },
  [fulfilled(verifyToken)]: (state, action) => ({
    ...state,
    session: {
      jwt: state.session.jwt,
      valid: true,
    },
  }),
};

// ==================================
// Reducer
// ==================================

const initialState = {
  session: null,
};

export default handleActions(ACTION_HANDLERS, initialState);
