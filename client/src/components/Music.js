import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import { logout } from '../actions/authActions';
import { buttonReset, setPlayingSong, setCurrentPlaylist} from '../actions/uiActions';
import {CHANGE_ARTIST, SET_PLAYING_ARTIST} from '../reducers/musicReducer';

//import QueryString from 'query-string';

import SongTable from './SongTable';
import { 
  SONG_TABLE_CB_ENUMS,
} from './SongTable';

import { 
  ControlBar_CB_ENUMS,
} from './ControlBar';

import EmbededYoutube from './EmbededYoutube';
import { 
  EmbededYoutube_CB_ENUMS,
} from './EmbededYoutube';

import SimilarArtistsTable from './SimilarArtistsTable';

import { containedInUser } from '../actions/userActions';

/*
Get profile functionality working
Make forward and back buttons work
Detect browser back navigate
Link artistname on profile page
https://stackoverflow.com/questions/39342195/intercept-handle-browsers-back-button-in-react-router
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
          activeSongName: "None selected",
          artistName: "",
          artistBio: "",
          artistURL: "",
          artistTags: [],
          artistImage: "",
          artistSimilar: [],
          artistTopSongs: [],
          heartedSongs: new Set(),
          ytId: "nZXRV4MezEw",
        }
        this.ytPlayer = React.createRef();
        this.controlBar = React.createRef();
        this.currentFocus = undefined;

        this.updateContent = this.updateContent.bind(this);
        this.reportVideoTime = this.reportVideoTime.bind(this);
    }

  static propTypes = {
    button: PropTypes.bool,
    authState: PropTypes.object.isRequired,
    buttonReset: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  reportVideoTime() {
    console.log("MUSIC.reportVideoTime()")
    this.ytPlayer.current.reportVideoTime();
  }

  onLogout = (e) => {
    e.preventDefault();
    this.props.buttonReset();
    this.props.logout();
  };

  componentDidMount() {
    let self = this;
    document.getElementById("main-music-app").addEventListener('build', function (e) { 
      console.log(e)

      if (e.detail.action === "PLAY") {
        let state = self.ytPlayer.current.getPlayerState();
        console.log("state " + state)
        if (state === 1) {
          self.ytPlayer.current.pauseVideo();
        } else if (state === 2) {
          self.ytPlayer.current.playVideo();
        }
      } else if (e.detail.action === "NEXT") {
        if (self.props.music.currentIndex+1 < self.props.music.currentPlaylist.length) {
          // TODO: play next song
          //self.props.skipNext()
          //let ind = self.props.music.currentIndex
          //self.onPlayFromTable(self.props.music.playingArtist, self.props.music.currentPlaylist[ind]);
        }

      } else if (e.detail.action === "PREV") {
        if (self.props.music.currentIndex-1 >= 0) {
          // TODO: play next song
          //self.props.skipPrev()
          //let ind = self.props.music.currentIndex
          //self.onPlayFromTable(self.props.music.playingArtist, self.props.music.currentPlaylist[ind]);
        }

      } else if (e.detail.action === "YT_SONG_END") {
        if (self.props.music.currentIndex+1 < self.props.music.currentPlaylist.length) {
          // TODO: play next song
          //self.props.skipNext()
          //let ind = self.props.music.currentIndex
          //self.onPlayFromTable(self.props.music.playingArtist, self.props.music.currentPlaylist[ind]);
        }
      } else if (e.detail.action === "SEEK") {
        console.log("seek to " + e.detail.value)
          self.ytPlayer.current.setSeekVideo(e.detail.value, true);
      }
  }, false);

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
    if (prevProps.music.selectedArtist !== this.props.music.selectedArtist) {
      this.updateContent();
    }
  }

  updateContent() {
    let imePesme = this.props.music.selectedArtist.replace(/&/g, '%26');
    let url = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + imePesme + "&api_key=" + this.props.lastfm_api + "&format=json" //C%C3%A9line+Dion
    
    fetch(url).then(response => {
        return response.json();
      }).then(data => {
        console.log(data);
        let name = data.artist.name;
        //console.log(name);
        let bio = data.artist.bio.summary.replace(/<\/?[^>]+(>|$)/g, "");
        let tags = data.artist.tags.tag;
        //let image = data.artist.image;
        let url = data.artist.url;
        let similar = data.artist.similar.artist;
        this.setState({artistName: name, artistURL: url, artistBio: bio, artistTags: tags, artistSimilar: similar});
      }).catch(err => {
        this.setState({artistName: "Request Error"});
        console.log('The request failed!!!! ' + err); 
      });
      

      let urlTopSongs = "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + imePesme + "&api_key=" + this.props.lastfm_api + "&limit=20&format=json"
      fetch(urlTopSongs).then(response => {
          return response.json();
        }).then(data => {
          console.log(data);
          let top = data.toptracks.track;
          this.setState({artistTopSongs: top});

          let extractArtistSongName = top.map( (val, i) => ({artist: val.artist.name, name: val.name}));
          console.log(extractArtistSongName);
          let d = {data: extractArtistSongName}

          if(this.props.authState.isAuthenticated) {

            axios
            .post("/api/users/contained_in", d ,{withCredentials:true})
            .then((res) => {
              
              //console.log(res);
              let names = res.data.map((track) => track.name);
              this.setState({heartedSongs: new Set(names)});
              console.log(new Set(names));
            } 
            )
            .catch((err) => {
              console.log(err);
            });

          }

          

        }).catch(err => {
          this.setState({artistName: "Request Error"});
          console.log('The request failed!!!! ' + err); 
        });

      let urlRecentSongs = "https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + imePesme + "&api_key=" + this.props.lastfm_api + "&limit=20&format=json"
      fetch(urlRecentSongs).then(response => {
          return response.json();
        }).then(data => {
          console.log("RecentTracks");
          console.log(data);
          let imgLen = data.topalbums.album[0].image.length;
          let imgageSrc = data.topalbums.album[0].image[imgLen-1]; //.image[val.image.length-1][Object.keys(val.image[val.image.length-1])[0]];
          this.setState({artistImage: imgageSrc["#text"]});
          //console.log(imgageSrc["#text"]);
          //let vID = this.getVID(data.toptracks.track[0].name);
        }).catch(err => {
          console.log('The request failed!!!! ' + err); 
        });
  }

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
      console.log("HEART " + data.songName)
      //https://stackoverflow.com/questions/44482788/using-a-set-data-structure-in-reacts-state
      if (data.isDelete) {
          let newHearted = new Set(this.state.heartedSongs);
          newHearted.delete(data.songName);
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
        //this.ytPlayer.current.loadNewVideo(vID)
        this.setState({ytId: vID});
       
      }).catch(err => {
        this.setState({artistName: "YT Request Error"});
        console.log('The request failed!!!! ' + err); 
      });
  }
  
  render() {
    //const {user} = this.props.authState;
    let tags = this.state.artistTags.map( (val, i) => 
      <span key={i}>{val.name + ", "}</span>
    );
    if (tags.length >= 2) {
        tags = tags.slice(0, tags.length-2);
    }
    
    return (
       <div className="container-fluid" id="main-music-app">
        <div className="row" >
            <div className="row" >
                <div className="col">
                    <EmbededYoutube ref={this.ytPlayer} videoId={this.state.ytId} callbackHandler={this.callbackHandler}> </EmbededYoutube>
                    
                </div>
            </div>
            </div>

            <div className="col-sm-6">
              <br></br>
              <div className="row" >
                <div className="col">
                  <h2> {this.props.music.selectedArtist} </h2>
                  <p>
                  Genres: {tags}
                  </p>
                </div>
                <div className="col">
                  <img src={this.state.artistImage} alt="album art" width="160px" style={{float: "right", marginRight: "16px"}}></img>
                </div>
              </div>
              
              <div>
                
              </div>
              <br></br>
            </div>
            
            <div className="row" >
            <div className="col-sm-6">
              <h5>Top Songs</h5>
              <SongTable songs={this.state.artistTopSongs} heartedSongs={this.state.heartedSongs} callbackHandler={this.callbackHandler}></SongTable>
              <br></br>
              <br></br>
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

const setPlayingArtist = ( artistName) => (dispatch) => {
  console.log("dispatching " + artistName);
  dispatch({
    type: SET_PLAYING_ARTIST,
    payload: artistName
  });
};

export default connect(mapStateToProps, { logout, buttonReset, changeArtist, setPlayingSong, setPlayingArtist, setCurrentPlaylist, containedInUser })(Music);