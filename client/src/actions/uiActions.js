import {
  BUTTON_CLICKED,
  BUTTON_RESET,
  IS_LOADING,
  PLAY_PRESSED
} from "./types";

import { SET_PLAYING_SONG, SET_CURRENT_PLAYLIST } from "../reducers/musicReducer";

export const buttonClicked = () => (dispatch, getState) => {
  dispatch({type: BUTTON_CLICKED});
};

export const buttonReset = () => (dispatch, getState) => {
  dispatch({type: BUTTON_RESET});
};

export const isLoading = () => (dispatch, getState) => {
  dispatch({type: IS_LOADING});
};

export const playPressed = () => (dispatch, getState) => {
  dispatch({type: PLAY_PRESSED});
};


export const setPlayingSong = value => ({
  type: SET_PLAYING_SONG,
  payload: value
});

export const setCurrentPlaylist = value => ({
  type: SET_CURRENT_PLAYLIST,
  payload: value
});


export const selectArtist = (id, artist) => ({
  id,
  artist,
  type: 'SELECT_ARTIST'
});