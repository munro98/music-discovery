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
import Secret from './Secret';
import Profile from './Profile';
import Home from './Home';

var divStyle = {
color:'white'
};

export class HomePage extends Component {

  componentDidMount() {
    // Check if session cookie is present
    store.dispatch(isAuth());
  }

  static propTypes = {
    button: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
  };

  render() {
    // if(this.props.authState.isAuthenticated) {
    //  return <Navigate replace to="/profile"/>
    // }

    return (
       <div className="container">
        <div className="main">
            <Routes>
            <Route exact path ="/" element={<Home></Home>}/>
              <Route exact path ="/profile" element={<Profile></Profile>}/>
              <Route exact path ="/login" element={<Login></Login>}/>
              <Route exact path ="/register" element={<Register></Register>}/>
              <Route exact path ="/secret" element={<Secret></Secret>}/>
            </Routes>
        </div>
    </div>
    )
  }
}
const mapStateToProps = (state) => ({ //Maps state to redux store as props
  button: state.ui.button,
  authState: state.auth

});

export default connect(mapStateToProps)(HomePage);
