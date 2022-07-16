import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from "axios";

import PropTypes from "prop-types";
import './style.css';
import { Navigate } from 'react-router-dom'
import { logout } from '../actions/authActions';
import { buttonReset} from '../actions/uiActions';

import EmbededYoutube from './EmbededYoutube';
import { 
  EmbededYoutube_CB_ENUMS,
} from './EmbededYoutube';
import SongTable from './SongTable';
import { 
  SONG_TABLE_CB_ENUMS,
} from './SongTable';

import { 
  ControlBar_CB_ENUMS,
} from './ControlBar';

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
      let tracks = res.data.map(function(track, index) {
        track.artist = {name: track.artist};
        return track;
      });
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

  callbackHandler = (type, data) => {
    console.log("callbackHandler " + type)
    switch(type) {
      case SONG_TABLE_CB_ENUMS.PLAY:
      console.log("play " + data.songName)
      this.props.setPlayingSong(data.songName);
      //this.props.setCurrentPlaylist(this.state.artistTopSongs); TODO
      this.props.setPlayingArtist(this.props.music.selectedArtist);
      this.setState({songIndex : data.songId});
      this.onPlayFromTable(data.songName);
      break;
      
      case SONG_TABLE_CB_ENUMS.HEART:
        console.log("HEART " + data)
      //https://stackoverflow.com/questions/44482788/using-a-set-data-structure-in-reacts-state
      if (data.isDelete) {
        let newHearted = new Set(this.state.heartedSongs);
        newHearted.delete(data.songName);
        console.log(newHearted);
        this.setState({heartedSongs : newHearted});
      } else {
          this.setState({heartedSongs : new Set(this.state.heartedSongs).add(data.songName)});
      }
      break;
      case ControlBar_CB_ENUMS.PLAY:
      //this.ytPlayer.current.playVideo();
      //this.props.callbackHandler(type, data);
      //console.log("play " + data)
      //this.props.setPlayingSong(this.state.artistTopSongs[this.state.songIndex].name);
      //this.props.setPlayingArtist(this.props.music.selectedArtist);
      if (this.state.songIndex <= this.state.artistTopSongs.length) {
        this.onPlayFromTable(this.state.artistTopSongs[this.state.songIndex].name);
      }
      break;
      case ControlBar_CB_ENUMS.PREV:
      if (this.state.songIndex > 1) {
        let newI = this.state.songIndex - 1;
          this.setState({songIndex : newI});
          this.onPlayFromTable(this.state.artistTopSongs[this.state.songIndex].name);
      } else {
          this.onPlayFromTable(this.state.artistTopSongs[this.state.songIndex].name);
      }
      break;
      case ControlBar_CB_ENUMS.NEXT:
      if (this.state.songIndex < this.state.artistTopSongs.length) {
          let newI = this.state.songIndex + 1;
          this.setState({songIndex : newI});
          this.onPlayFromTable(this.state.artistTopSongs[this.state.songIndex].name);
      }
      break;
      case ControlBar_CB_ENUMS.VOLUME_CHANGE:
      this.ytPlayer.current.setVolVideo(data.value);
      break;
      case ControlBar_CB_ENUMS.SEEK_CHANGE:
      //this.ytPlayer.current.setVolVideo(data);
      this.ytPlayer.current.setSeekVideo(data.value, false)
      break;
      case ControlBar_CB_ENUMS.SEEK_UP:
      this.ytPlayer.current.setSeekVideo(data.value, true)
      break;
      case EmbededYoutube_CB_ENUMS.END:
        console.log("play next song " )
        if (this.state.songIndex < this.state.artistTopSongs.length) {
          let newI = this.state.songIndex + 1;
          this.setState({songIndex : newI});
          this.onPlayFromTable(this.state.artistTopSongs[newI].name);
        }
      break;
      case EmbededYoutube_CB_ENUMS.PLAY:
        this.setState({songDuration: data.duration, songCurrTime: data.time, isPlaying: true});
      break;
      case EmbededYoutube_CB_ENUMS.PAUSE:
        this.setState({songDuration: data.duration, songCurrTime: data.time, isPlaying: false});
      break;
      case EmbededYoutube_CB_ENUMS.UPDATE:
        this.setState({songCurrTime: data.time});
        //this.controlBar.current.updateProgress(data.time / this.state.songDuration); // TODO: Add progress slider
      break;
    default:
    }
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