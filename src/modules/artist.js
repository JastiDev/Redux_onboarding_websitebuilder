import {createAction, handleActions, combineActions} from "redux-actions";
import {createSelector} from "reselect";
import {request} from "../helpers/http";
import {
  INIT_BUILDER,
  CREATE_ARTIST_BY_SPOTIFY,
  ADD_WEBSITE_URL,
  SEARCH_ARTISTS_BY_NAME,
  GET_SOCIAL_DATA,
  ADD_SOCIAL_URL,
  UPDATE_SOCIAL_URL,
  UPDATE_ARTIST_SOCIAL_TOKEN,
  GENERATE_WEBSITE,
  SELECT_ARTIST,
  GET_WEB_BUILDER,
  CREATE_WEB_BUILDER,
  UPDATE_WEB_BUILDER,
  GET_WEBSITE_COVER,
  UPDATE_WEBSITE_COVER,
} from "./actions";
import {fulfilled} from "../helpers";

// ==================================
// Selectors
// ==================================
export const selectedArtistSelector = createSelector(
  state => state.artist,
  artist => artist.selected
);

export const webBuilderSelector = createSelector(
  state => state.artist,
  artist => artist.webBuilder
);

export const websiteCoverSelector = createSelector(
  state => state.artist,
  artist => artist.websiteCover
);

// ==================================
// Actions
// ==================================
export const initBuilder = createAction(INIT_BUILDER);

export const createArtisitBySpotify = createAction(
  CREATE_ARTIST_BY_SPOTIFY,
  urlArtistBySpotify => {
    return request({
      url: "/artist/createArtistBySpotify",
      method: "post",
      body: {urlArtistBySpotify},
    });
  }
);

export const addWebsiteUrl = createAction(ADD_WEBSITE_URL, (artistId, websiteurl) => {
  return request({
    url: "/artist/addWebsiteUrl",
    method: "post",
    body: {artistId, websiteurl},
  });
});

export const searchArtistsByName = createAction(SEARCH_ARTISTS_BY_NAME, name => {
  return request({
    url: `/artist/openSearchByName?search=${name}&sort=popularity`,
    method: "get",
  });
});

export const selectArtist = createAction(SELECT_ARTIST);

export const getWebBuilder = createAction(GET_WEB_BUILDER, artistId => {
  return request({
    url: `/webbuilder?artistId=${artistId}`,
    method: "get",
  });
});

export const createWebBuilder = createAction(CREATE_WEB_BUILDER, artistId => {
  return request({
    url: "/webbuilder",
    method: "post",
    body: {
      artistId,
    },
  });
});

export const updateWebBuilder = createAction(UPDATE_WEB_BUILDER, webBuilder => {
  return request({
    url: "/webbuilder",
    method: "put",
    body: {
      webBuilder,
    },
  });
});

export const getSocialData = createAction(GET_SOCIAL_DATA, webBuilderId => {
  return request({
    url: `/webBuilder/socialdata?webBuilderId=${webBuilderId}`,
    method: "get",
  });
});

export const addSocialUrl = createAction(
  ADD_SOCIAL_URL,
  (webBuilderId, platformType, url) => {
    return request({
      url: "/webBuilder/socialdata",
      method: "post",
      body: {
        webBuilderId,
        type: platformType,
        url,
      },
    });
  }
);

export const updateSocialUrl = createAction(UPDATE_SOCIAL_URL, datum => {
  return request({
    url: "/webBuilder/socialdata",
    method: "put",
    body: {
      datum,
    },
  });
});

export const getWebsiteCover = createAction(GET_WEBSITE_COVER, webBuilderId => {
  return request({
    url: `/webbuilder/websiteCover?webBuilderId=${webBuilderId}`,
    method: "get",
  });
});

export const updateWebsiteCover = createAction(UPDATE_WEBSITE_COVER, websiteCover => {
  return request({
    url: "/webbuilder/websiteCover",
    method: "put",
    body: {
      websiteCover,
    },
  });
});

export const generateWebsite = createAction(GENERATE_WEBSITE, webBuilderId => {
  return request({
    url: "/webbuilder/generate",
    method: "post",
    body: {
      webBuilderId,
    },
  });
});

export const updateSocialToken = createAction(
  UPDATE_ARTIST_SOCIAL_TOKEN,
  (artistId, data) => {
    return request({
      url: `/api/musicbrainz/artists/${artistId}/social-token`,
      method: "put",
      body: data,
    });
  }
);

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [initBuilder]: state => ({
    ...state,
    webBuilder: {},
    websiteCover: {},
  }),
  [selectArtist]: (state, action) => {
    localStorage.setItem("jamfeed-selected-artist", JSON.stringify(action.payload));
    return {
      ...state,
      selected: action.payload,
    };
  },
  [fulfilled(createArtisitBySpotify)]: (state, action) => {
    localStorage.setItem("jamfeed-selected-artist", JSON.stringify(action.payload));
    return {
      ...state,
      selected: action.payload.data.artist,
    };
  },
  [fulfilled(addWebsiteUrl)]: (state, action) => {
    return {
      ...state,
    };
  },
  [combineActions(fulfilled(getWebBuilder), fulfilled(createWebBuilder))]: (
    state,
    action
  ) => ({
    ...state,
    webBuilder: action.payload.data,
  }),
  [fulfilled(updateWebBuilder)]: (state, action) => ({
    ...state,
    webBuilder: {
      ...state.webBuilder,
      ...action.payload.data,
    },
  }),
  [fulfilled(getWebsiteCover)]: (state, action) => ({
    ...state,
    websiteCover: action.payload.data,
  }),
  [fulfilled(updateWebsiteCover)]: (state, action) => ({
    ...state,
    websiteCover: {
      ...state.websiteCover,
      ...action.payload.data,
    },
  }),
};

// ==================================
// Reducer
// ==================================

export const initialState = {
  selected: null,
  webBuilder: {},
  websiteCover: {},
};

export default handleActions(ACTION_HANDLERS, initialState);
