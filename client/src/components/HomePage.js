import React, { Component } from 'react';

import { connect } from "react-redux";
import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import {
  Button,
} from "reactstrap";
import PropTypes from "prop-types";
import { buttonClicked } from "../actions/uiActions";
import store from '../store';
import { isAuth } from '../actions/authActions'
import {Navigate} from 'react-router-dom'

import Login from './Login';
import Register from './Register';
import Secret from './Secret';
import Profile from './Profile';
import Home from './Home';
import Music from './Music';
import NavBar from './NavBar';
//import RootNav from './NavBar';
import ControlBar from './ControlBar';

var divStyle = {
color:'white'
};

function RootNav (props){
  const navigation = useNavigate() // extract navigation prop here
  console.log("building navigaaaaaaaaaaaation" + navigation); 
  
return <NavBar {...props} navigation={navigation} /> //pass to your component.

}

export class HomePage extends Component {

  constructor(props) {
    super(props);

    this.musicComp = React.createRef();
    this.controlBar = React.createRef();
  }

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
    // }<NavBar></NavBar>

    return (
      <div>
        <RootNav lastfm_api={this.props.lastfm_api} ></RootNav>
      <body>
        
       <div className="container" style={{paddingTop: "60px", paddingBottom: "60px"}}>
        <div className="main">

            <Routes>
            <Route exact path ="/" element={<Music youtube_api={this.props.youtube_api} lastfm_api={this.props.lastfm_api}></Music>}/>
              <Route exact path ="/profile" element={<Profile></Profile>}/>
              <Route exact path ="/login" element={<Login></Login>}/>
              <Route exact path ="/register" element={<Register></Register>}/>
              <Route exact path ="/secret" element={<Secret></Secret>}/>
              <Route exact path ="/music" ref={this.musicComp} controlBar={this.controlBar} element={<Music youtube_api={this.props.youtube_api} lastfm_api={this.props.lastfm_api}></Music>}/>
            </Routes>
        </div>
        <br></br>
        <br></br>
    </div>
    <ControlBar ref={this.controlBar}></ControlBar>
      </body>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({ //Maps state to redux store as props
  button: state.ui.button,
  authState: state.auth

});

export default connect(mapStateToProps)(HomePage);
