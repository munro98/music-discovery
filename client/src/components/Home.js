import React, { Component } from 'react';
import Login from './Login';
import Register from './Register';
import Secret from './Secret';
import { connect } from "react-redux";
import { Route, Routes, Link } from 'react-router-dom'
import {
  Button,
} from "reactstrap";
import PropTypes from "prop-types";
import { buttonClicked } from "../actions/uiActions";
import store from '../store';
import { isAuth } from '../actions/authActions'
import {Navigate} from 'react-router-dom'


var divStyle = {
//color:'white'
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
    //if(this.props.authState.isAuthenticated) {
    //  return <Navigate exact to="/profile" replace={true}/>
    //}

    return (
       <div>
          <h1 style={divStyle}> <strong>MERN</strong> Sessions Auth App </h1>
          {this.props.youtube_api + "key"}
          <br/>
            <h5 style={divStyle}>Minimalistic Sessions based Authentication app <span role="img" aria-label="lock">🔒 </span><br></br>Built with React + Redux, NodeJS, Express, MongoDB and Bootstrap</h5>
            <h5 style={divStyle}>Uses Cookies <span role="img" aria-label="lock">🍪 </span></h5>
          <br/>
          <div>
          { this.props.button && <Link className='divStyle' to="/login">
               <Button size="lg"  color="light">Sign In</Button>
               </Link>}

             {this.props.button && <Link className='divStyle' to="/register">
               <Button  size="lg"  color="light">Register</Button>
             </Link>}
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
