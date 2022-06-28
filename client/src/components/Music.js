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
import { buttonReset} from '../actions/uiActions';

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
import { 
    SimilarArtistsTable_CB_ENUMS,
} from './SimilarArtistsTable';

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
          suggestions: [],
          ytId: "71rSc6LXlSo"
        }
        this.ytPlayer = React.createRef();
        this.controlBar = React.createRef();
        this.currentFocus = undefined;

        //this.onPlayDown = this.onPlayDown.bind(this);
        //this.loadAnother = this.loadAnother.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.searchArtist = this.searchArtist.bind(this);
        this.closeAllLists = this.closeAllLists.bind(this);
        this.addActive = this.addActive.bind(this)
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
    const parsed = QueryString.parse(window.location.search);
    console.log(parsed);

    let artistParam = "cher";
    if (parsed.search) {
      artistParam = parsed.search;
    }

    let url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistParam + "&api_key=" + this.props.lastfm_api + "&format=json" //C%C3%A9line+Dion
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

      let urlTopSongs = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + artistParam + "&api_key=" + this.props.lastfm_api + "&limit=20&format=json"
      fetch(urlTopSongs).then(response => {
          return response.json();
        }).then(data => {
          console.log(data);
          let top = data.toptracks.track;
          this.setState({artistTopSongs: top});
        }).catch(err => {
          this.setState({artistName: "Request Error"});
          console.log('The request failed!!!! ' + err); 
        });
  }

  callbackHandler = (type, data) => {
    //console.log("callbackHandler " + type)
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

  onPlayFromTable(songName) {
    let imeBenda = this.state.artistName.replace(/&/g, '%26');
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

        this.ytPlayer.current.playNewVideo(vID)

        if (true) {
          this.setState({activeArtistName: this.state.artistName, activeSongName: songName});
        }
        //this.setState({ytId: vID});
        //this.setState({artistTopSongs: top});
      }).catch(err => {
        this.setState({artistName: "YT Request Error"});
        console.log('The request failed!!!! ' + err); 
      });

  }
  
  searchArtist(str) {
    let imePesme = str.replace(/&/g, '%26');
    let url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + imePesme + "&api_key=" + this.props.lastfm_api + "&limit=20&format=json"

    let suggestions = [];
    fetch(url).then(response => {
        return response.json();
      }).then(data => {
        console.log(data);
        ///*
        data.results.artistmatches.artist.forEach((artist) => {suggestions.push(artist.name)})
        this.setState({suggestions: suggestions});
        //*/
      }).catch(err => {
        console.log('The request failed!!!! ' + err); 
      });
  }

  onSearchChange(e) {
    console.log(e.currentTarget.value);// e.g koan sound
    this.searchArtist(e.currentTarget.value);

    let a, b, i, val = e.currentTarget.value.toLowerCase();
    let inputEl = e.currentTarget;
    let self = this;
      /*close any already open lists of autocompleted values*/
      this.closeAllLists();
      if (!val) { return false;}
      this.currentFocus = -1;

      a = document.createElement("DIV");
      a.setAttribute("id", "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      e.currentTarget.parentNode.appendChild(a);
      for (i = 0; i < this.state.suggestions.length; i++) {
        if (this.state.suggestions[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {

          b = document.createElement("DIV");

          b.innerHTML = "<strong>" + this.state.suggestions[i].substr(0, val.length) + "</strong>";
          b.innerHTML += this.state.suggestions[i].substr(val.length);

          b.innerHTML += "<input type='hidden' value='" + this.state.suggestions[i] + "'>";

              b.addEventListener("click", function(e) {
                inputEl.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,*/
              self.closeAllLists();
          });
          a.appendChild(b);
        }
      }

  }

  addActive(x) {
    if (!x) return false;
    this.removeActive(x);
    if (this.currentFocus >= x.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = (x.length - 1);
    x[this.currentFocus].classList.add("autocomplete-active");
  }
  removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != document.getElementById("search")) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
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
       <div className="container-fluid">
        <div className="row" >
            <div className="row" >
                <div className="col-sm-6">
                    <EmbededYoutube ref={this.ytPlayer} YTid={this.state.ytId} callbackHandler={this.callbackHandler}> </EmbededYoutube>
                    <h2> {this.state.artistName} </h2>
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
  authState: state.auth
});

export default connect(mapStateToProps, { logout, buttonReset })(Music);