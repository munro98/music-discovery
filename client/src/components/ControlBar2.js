import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { playPressed } from "../actions/uiActions";
import{useSelector, useDispatch} from "react-redux"

import Slider from './Slider';

// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
    PLAY: 'ControlBar2/PLAY',
    PAUSE: 'ControlBar2/PAUSE',
    NEXT: 'ControlBar2/NEXT',
    PREV: 'ControlBar2/PREV',
    END: 'ControlBar2/END',
    VOLUME_CHANGE: 'ControlBar2/VOLUME_CHANGE',
    SEEK_CHANGE: 'ControlBar2/SEEK_CHANGE',
    SEEK_UP: 'ControlBar2/SEEK_UP',
    UPDATE_PROGRESS: 'ControlBar2/UPDATE_PROGRESS'
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

  
class ControlBar2 extends Component {

    constructor(props) {
        super(props)

        this.onSongEnded = this.onSongEnded.bind(this);

        this.onSongSeekChange = this.onSongSeekChange.bind(this);
        this.onVolumeChange = this.onVolumeChange.bind(this);
        this.onPlayDown = this.onPlayDown.bind(this);

        this.onPrevDown = this.onPrevDown.bind(this);
        this.onNextDown = this.onNextDown.bind(this);

        this.updateProgress = this.updateProgress.bind(this);

        this.slider = React.createRef();
        this.sliderVol = React.createRef();
    }

    onSongEnded() {
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.END,
            "");
    }

    onSongSeekChange(e) {
        let newProgress = e.target.value/10000.0;
        //this.setState({songProgress : newProgress});
        //console.log(newProgress);
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.SEEK_CHANGE,
            {value : newProgress});
    }

    onSongSeekUp(e) {
        let newProgress = e.target.value/10000.0;
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.SEEK_SEEK_UP,
            {value : newProgress});
    }

    onVolumeChange(e) {
        let newProgress = e.target.value/10000.0;
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.VOLUME_CHANGE,
            {value : newProgress});
        //this.setState({volume : newProgress});
    }

    onPlayDown(e) {
        let event = new CustomEvent('build', { detail: "some text" });

        document.getElementById("main-music-app").dispatchEvent(event);
        
    }

    onPrevDown(e) {
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.PREV,
            "");
    }

    onNextDown(e) {
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.NEXT,
            "");
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
    render() {

        
        // return (
        //     <footer  className="fixed-bottom flex-shrink-0 py-4 bg-dark text-white-50">
               
        //     <div>Hello</div>
        //     </footer>
        // )
        
        return (
            <footer id="sticky-footer" className="fixed-bottom footer mt-auto py-3 bg-dark">
                <div style={{}} >
            <div>
            
            
            <Slider ref={this.slider} onChange={this.onSongSeekChange}></Slider>
            

            <div style={{float : "left", margin: "16px", color: "rgb(240, 240, 240)"}}>
            <span > <a style={{color: "rgb(200, 200, 200)"}} href={
                    this.props.activeArtist === "" ? "/" : "?artist="+this.props.activeArtist
                    }> {"Artist: " + this.props.activeArtistName} </a> </span>
            <br></br>
            <span style={{color: "rgb(240, 240, 240)"}}>{this.props.activeSongName}</span>
            
            
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
        )
    }
}
const mapStateToProps = (state) => ({ //Maps state element in redux store to props
    authState: state.auth,
    status: state.status,
    loading: state.ui.loading

  });

const mapDispatchToProps = dispatch => {
    return {
        playPressed: id => {
        dispatch(playPressed())
      }
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(ControlBar2)

export {
    VIEW_CALLBACK_ENUMS as ControlBar2_CB_ENUMS,
  };