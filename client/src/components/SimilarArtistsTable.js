import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";


import {CHANGE_ARTIST} from '../reducers/musicReducer';

const divStyle = {
    width: "100%",
    height: "100%",
    bottom: "100px",
    //overflowY: "scroll"
};

class SimilarArtistsTable extends Component {
    constructor(props) {
        super(props)
        this.onClickArtist = this.onClickArtist.bind(this);
    }

    componentDidMount() {
    }

    onClickArtist(e) {
        console.log("SimilarArtistsTable.onClick index " + e.ind);
        let id = e.currentTarget.getAttribute('ind');
        this.props.changeArtist(this.props.similarArtists[id].name);
    }

    render() {
        let list = this.props.similarArtists;
        let items = list.map( (val, i) =>
            <tr key={i}>
                <td><img height="40px" src={val.image[val.image.length-1][Object.keys(val.image[val.image.length-1])[0]]} alt="artist" /></td>
                <td><button ind={i} onClick={this.onClickArtist}>{val.name}</button></td>
            </tr>

        );
        //<div class="d-flex justify-content-center">
        return (
            <div className="d-flex">
            <table id="songs">
                <col width="66"></col>
                <tbody>
                <tr>
                    <th></th>
                    <th>Similar Artists</th>
                </tr>
                {items}
                </tbody>
            </table>
            </div>
        )
    }
}
///*
const mapStateToProps = (state) => ({ //Maps state to redux store as props
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
  //*/
//export default (SimilarArtistsTable);
export default connect(mapStateToProps, {changeArtist})(SimilarArtistsTable);
  