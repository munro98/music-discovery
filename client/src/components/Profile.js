import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  Button,
  Card,
 CardTitle,
  CardSubtitle,
  CardBody
} from "reactstrap";
import PropTypes from "prop-types";
import './style.css';
import { Navigate } from 'react-router-dom'
import { logout } from '../actions/authActions';
import { buttonReset} from '../actions/uiActions';

import EmbededYoutube from './EmbededYoutube';


import SongTable from './SongTable';

export class Profile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      volume: 1.0,
      isPlaying: false,
      songIndex: 0,
      songDuration: 0,
      songCurrTime: 0,
      songProgress: 0.0,
      activeArtistName: "None selected",
      activeArtist: "None selected",
      activeSongName: "None selected",
      artistName: "",
      artistURL: "",
      ytId: ""
    }
    this.ytPlayer = React.createRef();
    this.controlBar = React.createRef();
}

  static propTypes = {
    button: PropTypes.bool,
    authState: PropTypes.object.isRequired,
    buttonReset: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };


  onLogout = (e) => {
    e.preventDefault();
    this.props.buttonReset();
    this.props.logout();
  };

  render2() {
    if(!this.props.authState.isAuthenticated) {
      return <Navigate exact to="/login" />
    }

    const {user} = this.props.authState;

    return (
      <div className="container-fluid" id="main-music-app">
         
      <div className="row" >
          <div className="row" >
              <div className="col-sm-6">
              <Card>
            <CardBody>
          <CardTitle><h1>{ user ? `Welcome, ${user.name} ${this.props.authState.isAuthenticated}`: ''} <span role="img" aria-label="party-popper">🎉 </span> </h1></CardTitle>
          <br/>
           <CardSubtitle><h5> You are now Logged In <span role="img" aria-label="clap">👏 </span></h5></CardSubtitle>
          <br/>
        <Button size="lg" onClick={this.onLogout} color="primary">Logout</Button>
            </CardBody>
          </Card>
              </div>
          </div>

          <div className="col-sm-6">
            <SongTable songs={this.state.artistTopSongs} callbackHandler={this.callbackHandler}></SongTable>
          </div>
          <div className="col-sm-6">
          
          <p >
          {this.state.artistBio + " "} 
          <a href={this.state.artistURL}>LastFM Link</a>
          </p>
          </div>
      </div>
  </div>
    )
  }

  render() {
    if(!this.props.authState.isAuthenticated) {
      return <Navigate exact to="/" />
    }

    const {user} = this.props.authState;

    return (
       <div className="container">
        <div className="main">
          <div className="container-fluid" id="main-music-app">
         
        <div className="row" >
            <div className="row" >
                <div className="col-sm-6">
                    <EmbededYoutube ref={this.ytPlayer} YTid={this.state.ytId} callbackHandler={this.callbackHandler}> </EmbededYoutube>
                    <br></br>
                    <br></br>
                </div>
            </div>
            <div className="col-sm-6">
            <h2> Profile of {user.name}</h2>
            <h5> My favourite Music <span role="img" aria-label="clap">👏 </span></h5>
              <SongTable songs={[]} callbackHandler={this.callbackHandler}></SongTable>
              <br></br>
              <br></br>
            </div>        
        </div>
        
    </div>
        </div>
    </div>
    )
  }
}
const mapStateToProps = (state) => ({ //Maps state to redux store as props
  button: state.ui.button,
  authState: state.auth
});

export default connect(mapStateToProps, { logout, buttonReset })(Profile);