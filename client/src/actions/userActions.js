import axios from "axios";
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    AUTH_SUCCESS,
    AUTH_FAIL,
    LOGOUT_SUCCESS,
    IS_LOADING,
  } from "./types";

export const saveTrack = ({ name, artist }) => (dispatch) => {
  axios
  .post("/api/users/track", { name, artist }, {withCredentials:true})
  .then((res) =>
      dispatch({
      payload: res.data
      })
  )
  .catch((err) => {
  });
}

export const deleteTrack = ({ name, artist }) => (dispatch) => {
  axios
  .delete("/api/users/track", { name, artist }, {withCredentials:true})
  .then((res) =>
      dispatch({
      payload: res.data
      })
  )
  .catch((err) => {
      
  });
}

// send a list of artists with song names and check they are in users profile
export const containedInUser = ({data}) => (dispatch) => {
  console.log(data);
  axios
  .post("/api/users/contained_in", {data} ,{withCredentials:true})
  .then((res) =>
      dispatch({
      payload: res.data
      })
  )
  .catch((err) => {
      
  });
}

// get the list of songs to be displayed
export const getAllMusic = () => (dispatch) => {
    axios
    .get("/api/users/track",{withCredentials:true})
    .then((res) =>
        dispatch({
        payload: res.data
        })
    )
    .catch((err) => {
        dispatch({
        type: AUTH_FAIL
        });
    });
}