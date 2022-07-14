import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { playPressed } from "../actions/uiActions";
import{useSelector, useDispatch} from "react-redux"

import {CHANGE_ARTIST} from '../reducers/musicReducer';

import Slider from './Slider';

// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
    PLAY: 'ControlBar/PLAY',
    PAUSE: 'ControlBar/PAUSE',
    NEXT: 'ControlBar/NEXT',
    PREV: 'ControlBar/PREV',
    END: 'ControlBar/END',
    VOLUME_CHANGE: 'ControlBar/VOLUME_CHANGE',
    SEEK_CHANGE: 'ControlBar/SEEK_CHANGE',
    SEEK_UP: 'ControlBar/SEEK_UP',
    UPDATE_PROGRESS: 'ControlBar/UPDATE_PROGRESS'
  };


const timeElapsedSyle = {
    fontFamily: "monospace, monospace",
}

const stylePlayerButton = {width: "40px", height: "40px", background: "transparent", border: "0", outline: "none"}

const footerStyle = {
    position: "absolute",
    bottom: "0",
    width: "100%",
    height: "60px", /* Set the fixed height of the footer here */
    lineHeight: "60px", /* Vertically center the text there */
    backgroundColor: "#f5f5f5"
  }

class ControlBar extends Component {

    constructor(props) {
        super(props)

        this.onSongEnded = this.onSongEnded.bind(this);

        this.onSongSeekChange = this.onSongSeekChange.bind(this);
        this.onVolumeChange = this.onVolumeChange.bind(this);
        this.onPlayDown = this.onPlayDown.bind(this);

        this.onPrevDown = this.onPrevDown.bind(this);
        this.onNextDown = this.onNextDown.bind(this);

        this.updateProgress = this.updateProgress.bind(this);

        this.onClickArtist = this.onClickArtist.bind(this);

        this.slider = React.createRef();
        this.sliderVol = React.createRef();
    }

    componentDidMount() {
        let self = this;
        document.getElementById("control-bar").addEventListener('build', function (e) {
            if (e.detail.action == "UPDATE_PROGRESS") { 
                let factor = e.detail.value;
                if (factor >= 0.0 || factor <= 1.0 && !isNaN(factor)) {
                    //console.log("UPDATE_PROGRESS" + e.detail.value);
                    self.slider.current.setFactor(factor);
                }
            }
        });
    }

    onSongEnded() {
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.END,
            "");
    }

    onSongSeekChange(e) {
        let newProgress = e.target.value/10000.0;
        let event = new CustomEvent('build', { detail: {action: "SEEK", value: newProgress} });
        document.getElementById("main-music-app").dispatchEvent(event);
    }

    onSongSeekUp(e) {
        /*
        let newProgress = e.target.value/10000.0;
        let event = new CustomEvent('build', { detail: {action: "SEEK", value: newProgress} });
        document.getElementById("main-music-app").dispatchEvent(event);
        //this.props.callbackHandler(
        //    VIEW_CALLBACK_ENUMS.SEEK_SEEK_UP,
        //    {value : newProgress});
        */
    }

    onVolumeChange(e) {
        let newProgress = e.target.value/10000.0;
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.VOLUME_CHANGE,
            {value : newProgress});
        //this.setState({volume : newProgress});
    }

    onPlayDown(e) {
        let event = new CustomEvent('build', { detail: {action: "PLAY"} });
        document.getElementById("main-music-app").dispatchEvent(event);
    }

    onPrevDown(e) {
        let event = new CustomEvent('build', { detail: {action: "PREV"} });
        document.getElementById("main-music-app").dispatchEvent(event);
    }

    onNextDown(e) {
        let event = new CustomEvent('build', { detail: {action: "NEXT"} });
        document.getElementById("main-music-app").dispatchEvent(event);
    }

    secondsToMMSS(s) {
        s = Math.floor(s);
        let m = Math.floor(s / 60);
        let secs = Math.floor(s % 60);
        return ""+m+":"+secs;
    }

    updateProgress(f) {
        this.slider.current.setFactor(f);
    }

    onClickArtist() {
        console.log("ControlBar.onClickArtist:");
        this.props.changeArtist(this.props.music.playingArtist);
    }

    render() {
        return (
            <div id="control-bar">
            <footer id="sticky-footer" className="fixed-bottom footer mt-auto py-1" style={{backgroundColor: "rgb(80, 80, 80)"}}>
                <div style={{}} >
            <div>
            <Slider ref={this.slider} onChange={this.onSongSeekChange}></Slider>
            <div style={{float : "left", marginLeft: "12px", marginBottom: "18px", color: "rgb(240, 240, 240)"}}>
            <span > <button class="btn btn-link" style={{color: "rgb(240, 240, 240)", height: "26px"}} onClick={this.onClickArtist}> {this.props.music.playingArtist} </button> </span>
            <br></br>
            <span > <button class="btn btn-link" style={{color: "rgb(240, 240, 240)", height: "26px", textDecoration: "none"}} onClick={this.onClickArtist}> {this.props.music.playingSong} </button> </span>
            </div>
            </div>
            </div>

            <div style={{}}> 
                <div style={{ width: "240px",height: "50px",marginTop: "4px", marginLeft: "auto", marginRight: "auto", columnCount: 5/*, backgroundColor: "rgb(255, 0, 0)"*/}}> 
                    <div><center>
                    
                        <button id="play-button" style={stylePlayerButton} onClick={this.onPrevDown}>
                            <svg id="icon-skip-previous" viewBox="0 0 24 24" width="100%" height="100%" style={{fill: "rgb(200, 200, 200)"}}>
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path>
                                <path d="M0 0h24v24H0z" fill="none"></path>
                            </svg>
                        </button>
                        
                    </center></div>
                    <div><center> 
                        
                        <button id="play-button" style={stylePlayerButton} onClick={this.onPlayDown}>
                            <svg id="icon-skip-play" viewBox="0 0 24 24" width="100%" height="100%" style={{fill: "rgb(200, 200, 200)"}}>
                                <path d="M 17.488289,12 4.3498907,3.6967476 V 20.303252 Z"></path>
                                <path d="M0 0h24v24H0z" fill="none"></path>
                            </svg>
                        </button>
                        
                         </center></div>
                    <div><center>

                    <button id="play-button" style={stylePlayerButton} onClick={this.onNextDown}>
                        <svg id="icon-skip-next" viewBox="0 0 24 24" width="100%" height="100%" style={{fill: "rgb(200, 200, 200)"}}>
                            <path d="M 18,18 H 16 V 6 h 2 z M 14.5,12 6,6 v 12 z"></path>
                            <path d="M0 0h24v24H0z" fill="none"></path>
                        </svg>
                    </button>
                        
                    </center></div>
                </div>
                
                </div>
          </footer>
          </div>
        )
    }
}
const mapStateToProps = (state) => ({ //Maps state element in redux store to props
    authState: state.auth,
    status: state.status,
    loading: state.ui.loading,
    music: state.music
  });

const changeArtist = ( artistName) => (dispatch) => {
console.log("dispatching " + artistName);
let imePesme = artistName.replace(/&/g, '%26');
        window.history.pushState("", 'Music', "/music/?artist="+imePesme);
dispatch({
    type: CHANGE_ARTIST,
    payload: artistName
});
};

export default connect(mapStateToProps, {changeArtist})(ControlBar)

export {
    VIEW_CALLBACK_ENUMS as ControlBar_CB_ENUMS,
  };