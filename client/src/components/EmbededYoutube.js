import React, { Component } from 'react'
import PropTypes from 'prop-types'

// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
    PLAY: 'EmbededYoutube/PLAY',
    PAUSE: 'EmbededYoutube/PAUSE',
    END: 'EmbededYoutube/END',
    UPDATE: 'EmbededYoutube/UPDATE',
  };

class EmbededYoutube extends Component {
    constructor(props) {
        super(props)

        this.playVideo = this.playVideo.bind(this);
        this.onSongEnded = this.onSongEnded.bind(this);
        this.onReady = this.onReady.bind(this);
        this.reportVideoTime = this.reportVideoTime.bind(this);
        this.loadYT = null;
    }

    componentDidMount() {
        // https://developers.google.com/youtube/iframe_api_reference
        if (!this.loadYT) {
            this.loadYT = new Promise((resolve) => {
                const tag = document.createElement('script')
                tag.src = 'https://www.youtube.com/iframe_api'
                const firstScriptTag = document.getElementsByTagName('script')[0]
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
                window.onYouTubeIframeAPIReady = () => resolve(window.YT)
            })
            }
            this.loadYT.then((YT) => {
            this.player = new YT.Player(this.youtubePlayerAnchor, {
                height: this.props.height || 390,
                width: this.props.width || 640,
                videoId: this.props.YTid,
                events: {
                onStateChange: this.onPlayerStateChange,
                onReady: this.onReady
                }
            })
            })
    }

    onReady(e) {
        let self = this;
            setInterval(function()  {
            //console.log(self.player.getCurrentTime());
            ///*
            //console.log(self.ytPlayer.current.player);
            if (self.player != undefined) {
                //console.log(self.player.getCurrentTime());
                self.reportVideoTime();
            }
            //*/
        }
        ,100);
    }

    reportVideoTime(){
        return;// TODO: 
        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.UPDATE,
            {time : this.player.getCurrentTime()});
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

    // https://getbootstrap.com/docs/4.0/utilities/embed/
    render() {
        return (
            <div className="justify-content-center embed-responsive embed-responsive-21by9">
                <div className="embed-responsive-item" ref={(r) => { this.youtubePlayerAnchor = r }}></div>
            </div>
            
        )
    }
}

export const ytem = ({ embedId }) => (
    <div className="video-responsive">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );

export default EmbededYoutube

export {
    VIEW_CALLBACK_ENUMS as EmbededYoutube_CB_ENUMS,
  };