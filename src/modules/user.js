import {createAction, handleActions} from "redux-actions";
import {createSelector} from "reselect";
import {request} from "../helpers/http";
import {UPDATE_USER} from "./actions";
import {fulfilled} from "../helpers";
import {verifyToken} from "./auth";

// ==================================
// Selectors
// ==================================
export const userSelector = createSelector(
  state => state.user,
  user => user.data
);

// ==================================
// Actions
// ==================================
export const updateUser = createAction(UPDATE_USER, params => {
  return request({
    url: "/api/musicbrainz/users/me",
    method: "put",
    body: params,
  });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [fulfilled(verifyToken)]: (state, action) => ({
    ...state,
    data: action.payload.data,
  }),
  [fulfilled(updateUser)]: (state, action) => ({
    ...state,
    data: action.payload.data,
  }),
};

// ==================================
// Reducer
// ==================================

const initialState = {
  data: null,
};

export default handleActions(ACTION_HANDLERS, initialState);
