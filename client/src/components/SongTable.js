import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from 'prop-types'

import { saveTrack, deleteTrack } from '../actions/userActions';

// list of all possible enums in child
const VIEW_CALLBACK_ENUMS = {
    PLAY: 'SONG_TABLE/PLAY',
  };

const divStyle = {
    width: "100%",
    height: "100%",
    bottom: "100px",
    //overflowY: "scroll"
};

const stylePlayerButton = {width: "40px", height: "40px", background: "transparent", border: "0", outline: "none"}

// A table to represent a list of songs
class SongTable extends Component {
    constructor(props) {
        super(props)

        this.onPlayDown = this.onPlayDown.bind(this);
        this.onHeartPress = this.onHeartPress.bind(this);
    }

    // Trigger music video to play
    onPlayDown(e) {
        let id = e.currentTarget.getAttribute('song_id');
        let songName = e.currentTarget.getAttribute('song_name');
        console.log("playing " + e.currentTarget + " "+ id);

        this.props.callbackHandler(
            VIEW_CALLBACK_ENUMS.PLAY,
            {songName : songName, songID : id});
    }

    // For saving/delete from favourite tracks
    onHeartPress(e) {
        let id = e.currentTarget.getAttribute('song_id');
        let songName = e.currentTarget.getAttribute('song_name');
        //console.log(this.props.songs[id]);

        const track = this.props.songs[id];
        console.log("saving " + track.artist.name + " - " + track.name);
        const t = {name: track.name, artist: track.artist.name};
        this.props.saveTrack(t);
    }

    render() {
        let list = this.props.songs;
        let items = list.map( (val, i) =>
            <tr key={i} style={ i % 2 === 0 ? {backgroundColor: "rgba(0,0,0, 0.1)"} : {backgroundColor: "rgba(0,0,0, 0.0)"} }>
                <td style={{verticalAlign: "center",overflow: 'hidden', whiteSpace: 'nowrap'}}>
                <button id="hear-button" style={stylePlayerButton} onClick={this.onHeartPress} song_id={i} song_name={val.name}>
                <span style={{fontSize: "30px", color: "rgb(200, 200, 200)", position: "relative", top: "-4px"}}>&#9829;</span>
                </button>
                </td>
                <td style={{overflow: 'hidden', whiteSpace: 'nowrap'}}>
                <button id="play-button" style={stylePlayerButton} onClick={this.onPlayDown} song_id={i} song_name={val.name}>
                    <svg id="icon-skip-play" viewBox="0 0 24 24" width="100%" height="100%" style={{fill: "rgb(200, 200, 200)"}}>
                        <path d="M 17.488289,12 4.3498907,3.6967476 V 20.303252 Z"></path>
                        <path d="M0 0h24v24H0z" fill="none"></path>
                    </svg>
                </button>
                </td>
                <td style={{verticalAlign: "center"}}> <span style={{align: "left"}}>{" " + i}</span>{" -  " + val.name }</td>
                <td></td>
            </tr>
        );
        return (
            <div style={divStyle}>
            <table id="songs" style={{width: "100%"}}>
                <tbody>
                <tr>
                    <th style={{width: "30px"}}></th>
                    <th style={{width: "30px"}}></th>
                    <th></th>
                </tr>
                {items}
                </tbody>
            </table>
            
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    button: state.ui.button,
    authState: state.auth,
    status: state.status,
    loading: state.ui.loading
  });

export default connect(mapStateToProps,{saveTrack, deleteTrack})(SongTable);

export {
    VIEW_CALLBACK_ENUMS as SONG_TABLE_CB_ENUMS,
  };