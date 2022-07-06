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
import { Navigate } from 'react-router-dom'
import { logout } from '../actions/authActions';
import { buttonReset, changeControlBarText} from '../actions/uiActions';
import {CHANGE_ARTIST} from '../reducers/musicReducer';

import QueryString from 'query-string';

import SongTable from './SongTable';
import { 
  SONG_TABLE_CB_ENUMS,
} from './SongTable';

import ControlBar from './ControlBar';
import { 
  ControlBar_CB_ENUMS,
} from './ControlBar';

import EmbededYoutube from './EmbededYoutube';
import { 
  EmbededYoutube_CB_ENUMS,
} from './EmbededYoutube';

import SimilarArtistsTable from './SimilarArtistsTable';

/*

Fix Search for artists
Change similar artists table to buttons and use redux to update music comp selected artist

Connect control bar to Music component

Show favourited songs on profile page
*/

export class Music extends Component {

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
          artistBio: "",
          artistURL: "",
          artistTags: [],
          artistImage: "",
          artistSimilar: [],
          artistTopSongs: [],
          ytId: ""
        }
        this.ytPlayer = React.createRef();
        this.controlBar = React.createRef();
        this.currentFocus = undefined;

        this.updateContent = this.updateContent.bind(this);

        //this.onPlayDown = this.onPlayDown.bind(this);
        //this.loadAnother = this.loadAnother.bind(this);
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

  componentDidMount() {
    document.getElementById("main-music-app").addEventListener('build', function (e) { console.log(e)/* ... */ }, false);

    const urlParams = new URLSearchParams(window.location.search);
    console.log("Url params " + urlParams);
    let artistParam = "cher";
    if (urlParams.get("artist")) {
      artistParam = urlParams.get("artist");
      this.props.changeArtist(artistParam);
    }
    

    this.updateContent();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("Music component updating ")
    if (prevProps.music.selectedArtist != this.props.music.selectedArtist) {
      this.updateContent();
    }
  }

  updateContent() {
    let imePesme = this.props.music.selectedArtist.replace(/&/g, '%26');
    let url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + imePesme + "&api_key=" + this.props.lastfm_api + "&format=json" //C%C3%A9line+Dion
    ///*
    fetch(url).then(response => {
        return response.json();
      }).then(data => {
        console.log(data);
        let name = data.artist.name;
        //console.log(name);
        let bio = data.artist.bio.summary.replace(/<\/?[^>]+(>|$)/g, "");
        let tags = data.artist.tags.tag;
        let image = data.artist.image;//[data.artist.image.length-1];
        let url = data.artist.url;
        let similar = data.artist.similar.artist;
        this.setState({artistName: name, artistURL: url, artistBio: bio, artistTags: tags, artistImage: image, artistSimilar: similar});
      }).catch(err => {
        this.setState({artistName: "Request Error"});
        console.log('The request failed!!!! ' + err); 
      });
      //*/

      let urlTopSongs = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + imePesme + "&api_key=" + this.props.lastfm_api + "&limit=20&format=json"
      fetch(urlTopSongs).then(response => {
          return response.json();
        }).then(data => {
          console.log(data);
          let top = data.toptracks.track;
          this.setState({artistTopSongs: top});
          //let vID = this.getVID(data.toptracks.track[0].name);
        }).catch(err => {
          this.setState({artistName: "Request Error"});
          console.log('The request failed!!!! ' + err); 
        });
  }

  callbackHandler = (type, data) => {
    console.log("callbackHandler " + type)
    switch(type) {
      case SONG_TABLE_CB_ENUMS.PLAY:
      console.log("play " + data.songName)

      this.setState({songIndex : data.songId});
      this.onPlayFromTable(data.songName);

      break;
      case ControlBar_CB_ENUMS.PLAY:
      //this.ytPlayer.current.playVideo();
      //this.props.callbackHandler(type, data);
      //console.log("play " + data)
      if (this.state.songIndex <= this.state.artistTopSongs.length) {
        this.onPlayFromTable(this.state.artistTopSongs[this.state.songIndex].name);
      }
      //this.onPlayDown();
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
      /* Unused
      case CALLBACK_ENUMS.PLAY:
      // manipulate data if required
      //this.props.callbackHandler(type, data);
      console.log("play " + data)
      this.onPlayDown();
      break;
    case CALLBACK_ENUMS.PREV:
      this.onPrevDown();
      break;
    case CALLBACK_ENUMS.NEXT:
      this.onNextDown();
      break;
    case CALLBACK_ENUMS.END:
      this.onSongEnded();
      break;
    */
    default:
      // bubble up all other actions to parent
      //this.props.callbackHandler(type, data);
    }
  }

  getVID(songName) {
    let imeBenda = this.props.music.selectedArtist.replace(/&/g, '%26');
    let imePesme = songName.replace(/&/g, '%26');
    // https://developers.google.com/youtube/v3/docs/search
    let url = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q="
			  + imeBenda + "+" + imePesme + "&type=video&videoDefinition=any&videoEmbeddable=true&key=" + this.props.youtube_api;
    fetch(url).then(response => {
        return response.json();
      }).then(data => {
        console.log(data);
        let vID = data.items[0].id.videoId;
        console.log(vID);

        return vID;
      }).catch(err => {
        this.setState({artistName: "YT Request Error"});
        console.log('The request failed!!!! ' + err); 
      });

  }

  onPlayFromTable(songName) {
    let imeBenda = this.props.music.selectedArtist.replace(/&/g, '%26');
    let imePesme = songName.replace(/&/g, '%26');
    // https://developers.google.com/youtube/v3/docs/search
    let url = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q="
			  + imeBenda + "+" + imePesme + "&type=video&videoDefinition=any&videoEmbeddable=true&key=" + this.props.youtube_api;
    fetch(url).then(response => {
        return response.json();
      }).then(data => {
        console.log(data);
        let vID = data.items[0].id.videoId;
        console.log(vID);

        this.ytPlayer.current.loadNewVideo(vID)

        if (true) {
          this.setState({activeArtistName: this.props.music.selectedArtist, activeSongName: songName});
        }
        //this.setState({ytId: vID});
        //this.setState({artistTopSongs: top});
      }).catch(err => {
        this.setState({artistName: "YT Request Error"});
        console.log('The request failed!!!! ' + err); 
      });

  }
  
  render() {
    const {user} = this.props.authState;

    let tags = this.state.artistTags.map( (val, i) => 
      <span>{val.name + ", "}</span>
    );
    if (tags.length >= 2) {
        tags = tags.slice(0, tags.length-2);
    }
    
    return (
       <div className="container-fluid" id="main-music-app">
         
        <div className="row" >
            <div className="row" >
                <div className="col-sm-6">
                    <EmbededYoutube ref={this.ytPlayer} YTid={this.state.ytId} callbackHandler={this.callbackHandler}> </EmbededYoutube>
                    <h2> {this.props.music.selectedArtist} </h2>
                    <p>
                    Genres: {tags}
                    </p>
                    <br></br>
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
            <SimilarArtistsTable similarArtists={this.state.artistSimilar} callbackHandler={this.callbackHandler}></SimilarArtistsTable>
            </div>
        
        </div>
        
    </div>
    )
  }
}


const mapStateToProps = (state) => ({ //Maps state to redux store as props
  button: state.ui.button,
  authState: state.auth,
  music: state.music
});

const changeArtist = ( artistName) => (dispatch) => {
  console.log("dispatching " + artistName);
  dispatch({
    type: CHANGE_ARTIST,
    payload: artistName
  });
};

export default connect(mapStateToProps, { logout, buttonReset, changeArtist, changeControlBarText })(Music);