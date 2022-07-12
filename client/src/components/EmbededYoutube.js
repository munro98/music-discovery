import React, { Component } from 'react'

import PropTypes from 'prop-types'

import YouTube from 'react-youtube';

import "./appstyles.css";

// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
    PLAY: 'EmbededYoutube/PLAY',
    PAUSE: 'EmbededYoutube/PAUSE',
    END: 'EmbededYoutube/END',
    UPDATE: 'EmbededYoutube/UPDATE',
  };

  // https://developers.google.com/youtube/iframe_api_reference
class EmbededYoutube extends Component {
    constructor(props) {
        super(props)

        this.playVideo = this.playVideo.bind(this);
        this.onSongEnded = this.onSongEnded.bind(this);
        this.onReady = this.onReady.bind(this);
        this.reportVideoTime = this.reportVideoTime.bind(this);
        this.loadYT = null;
        this.onReady = this.onReady.bind(this);
        this.player = null;
    }

    componentDidMount() {
    }
    reportVideoTime(){
        if (this.player != undefined) {
            if (this.getPlayerState() == 1 || this.getPlayerState() == 2) {
                let factor = this.player.getCurrentTime()/this.player.getDuration();
                //console.log("send" + factor);
                if (factor >= 0.0 || factor <= 1.0 && !isNaN(factor)) {
                    let event = new CustomEvent('build', { detail: {action: "UPDATE_PROGRESS", value: factor} });
                    document.getElementById("control-bar").dispatchEvent(event);
                }
            }
        }
        
    }

    setVideoTime(f){
        //time = duration_slider.noUiSlider.get();
        //player.seekTo(time);
        //player.seekTo(time);
    }

    loadNewVideo(vID) {
        this.player.loadVideoById(vID);
    }

    playVideo() {
        this.player.playVideo();
    }
    pauseVideo() {
        this.player.pauseVideo();
    }
    stopVideo() {
        this.player.stopVideo();
    }
    setVolVideo() {
        this.player.setVolume();
    }
    
    /*
    -1 – unstarted
    0 – ended
    1 – playing
    2 – paused
    3 – buffering
    5 – video cued
    */
    getPlayerState() {
        return this.player.getPlayerState();
        
    }

    setSeekVideo(f, allowSeekAhead) {
        let seconds = f * this.player.getDuration();
        this.player.seekTo(seconds, allowSeekAhead);
    }

    getDuration() {
        return this.player.getDuration();
    }

    getCurrentTime() {
        return this.player.getCurrentTime();
    }

    getVolume() {
        return this.player.getVolume();
    }

    onPlayerStateChange = (e) => {
        console.log(e.data);
        //if (typeof this.props.onStateChange === 'function') {
        //    this.props.onStateChange(e)
        //}
        //
        if (e.data === -1) {
            //console.log("loaded");
        }
        else if (e.data === 1) {
            //console.log("playing");
            this.props.callbackHandler(
                VIEW_CALLBACK_ENUMS.PLAY,
                {duration: this.getDuration(), time : this.getCurrentTime()});

        } else if (e.data === 2) {
            this.props.callbackHandler(
                VIEW_CALLBACK_ENUMS.PLAY,
                {duration: this.getDuration(), time : this.getCurrentTime()});

        } else if (e.data === 0) {
            //console.log("ended");
            this.onSongEnded();
        }

    }

    onSongEnded() {
        let event = new CustomEvent('build', { detail: "YT_SONG_END" });
        document.getElementById("main-music-app").dispatchEvent(event);
    }

    onSongSeekChange(e) {
        let newProgress = e.target.value/10000.0;
        this.setState({songProgress : newProgress});
        console.log(newProgress);
    }

    onVolumeChange(e) {
        let newProgress = e.target.value/10000.0;
        this.setState({volume : newProgress});
    }

    onPlayDown(e) {
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.PLAY,
            "");
    }

    onReady(e) {
        // access to player in all event handlers via event.target
        this.player = e.target;
        e.target.pauseVideo();
        ///*
        let self = this;
            setInterval(function()  {
            //console.log(self.player.getCurrentTime());
            if (self.player != undefined) {
                //console.log(self.player.getCurrentTime());
                self.reportVideoTime();
            }

        }
        ,2000);
        //*/
    }

    // https://getbootstrap.com/docs/4.0/utilities/embed/
    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
            },
          };

        return <YouTube className="video-responsive" videoId={this.props.videoId} opts={opts} onReady={this.onReady} />;
    }
}

/*
// Wrap the player in functional component so I can use setInterval with useEffect hook
export default function EmbededYoutubeWrapper(props) {
    //const [counter, setCounter] = useState(0);
    //https://bobbyhadz.com/blog/react-call-function-in-child-component
    const childRef = useRef(null);
  
    useEffect(() => {
      const interval = setInterval(() => {
        //setCounter((prevCounter) => prevCounter + 1);
        childRef.current.reportVideoTime();
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <EmbededYoutube {...props} ref={childRef}></EmbededYoutube>
    );
  }
  */


export default EmbededYoutube
export {
    VIEW_CALLBACK_ENUMS as EmbededYoutube_CB_ENUMS,
  };