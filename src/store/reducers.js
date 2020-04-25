import {combineReducers} from "redux";
import authReducer from "../modules/auth";
import userReducer from "../modules/user";
import artistReducer from "../modules/artist";
import templateReducer from "../modules/template";
import loadingReducer from "../modules/loading";

export const makeRootReducer = asyncReducers => {
  const reducers = {
    loading: loadingReducer,
    auth: authReducer,
    user: userReducer,
    artist: artistReducer,
    template: templateReducer,
    ...asyncReducers,
  };
  return combineReducers(reducers);
};

export default makeRootReducer;
