import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from "axios";

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
      ytId: "",
      artistTopSongs: [],
      heartedSongs: new Set(),
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

  componentDidMount() {

    axios
    .get("/api/users/track",{withCredentials:true})
    .then((res) => {
      console.log(res);
      let tracks = res.data;
      let names = res.data.map((track) => track.name);
      this.setState({
        artistTopSongs: tracks,
        heartedSongs: new Set(names)
      });
      //console.log(new Set(names));
    } 
    )
    .catch((err) => {
      console.log(err);
    });
  }


  onLogout = (e) => {
    e.preventDefault();
    this.props.buttonReset();
    this.props.logout();
  };

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
                <div className="col">
                    <EmbededYoutube ref={this.ytPlayer} YTid={this.state.ytId} callbackHandler={this.callbackHandler}> </EmbededYoutube>
                    <br></br>
                    <br></br>
                </div>
            </div>
            <div className="col">
            <h2> Profile of {user.name}</h2>
            <h5> My Hearted Music</h5>
              <SongTable songs={this.state.artistTopSongs} heartedSongs={this.state.heartedSongs} showArtistName={true} callbackHandler={this.callbackHandler}></SongTable>
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