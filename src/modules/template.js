import {handleActions, createAction} from "redux-actions";
import {createSelector} from "reselect";
import {GET_TEMPLATES} from "./actions";
import {request} from "../helpers/http";
import {fulfilled} from "../helpers";

// ==================================
// Selectors
// ==================================
export const templatesSelector = createSelector(
  state => state.template,
  template => template.list
);

// ==================================
// Actions
// ==================================
export const getTemplates = createAction(GET_TEMPLATES, () => {
  return request({
    url: "/webTemplates",
    method: "get",
  });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [fulfilled(getTemplates)]: (state, action) => ({
    list: action.payload.data,
  }),
};

// ==================================
// Reducer
// ==================================

const initialState = {
  list: [],
};

export default handleActions(ACTION_HANDLERS, initialState);
