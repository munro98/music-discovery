import React, { Component } from 'react';

import { connect } from "react-redux";
import { Route, Routes, Link } from 'react-router-dom'
import {
  Button,
} from "reactstrap";
import PropTypes from "prop-types";
import { buttonClicked } from "../actions/uiActions";
import './style.css';
import store from '../store';
import { isAuth } from '../actions/authActions'
import {Navigate} from 'react-router-dom'

import Login from './Login';
import Register from './Register';

export class NavBar extends Component {
  componentDidMount() {
    // Check if session cookie is present
    store.dispatch(isAuth());
  }

  static propTypes = {
    button: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
  };

  render() {
    return (
       <div className="navbar-static-top navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Music Discovery</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            <li className="nav-item active">
                <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">Logout</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="/profile">Profile</a>
            </li>
            </ul>
        </div>
        </div>
    )
  }
}
const mapStateToProps = (state) => ({ //Maps state to redux store as props
  authState: state.auth
});

export default connect(mapStateToProps)(NavBar);
