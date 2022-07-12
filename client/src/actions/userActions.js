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


//Add a favourite song to the users accound
export const login = ({ track }) => (dispatch) => {
    // Headers
    const headers = {
      headers: {
        "Content-Type": "application/json"
      }
    };
  
    // Request body
    const body = JSON.stringify({ email, password });
  
    axios
      .post("/api/users/login/favourites", body, headers)
      .then((res) => {
        console.log(res);
        dispatch({
          type: "ADDED_SUCCESS",
          payload: res.data
        });
      }
      )
      .catch((err) => {
        dispatch({
            type: AUTH_FAIL
            });
      });
};


// get the list of songs to be displayed
export const getFavouriteMusic = () => (dispatch) => {
    axios
    .get("/api/users/favourites",{withCredentials:true})
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