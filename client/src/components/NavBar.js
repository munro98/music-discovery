import React, { Component } from 'react';

import { connect } from "react-redux";
import { Route, Routes, Link } from 'react-router-dom'
import {
  Button,
} from "reactstrap";
import PropTypes from "prop-types";
import { buttonClicked } from "../actions/uiActions";
import './style.css';
import store from '../store';
import { isAuth } from '../actions/authActions'
import {Navigate} from 'react-router-dom'

import Login from './Login';
import Register from './Register';

import './appstyles.css';

export class NavBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      artistName: "",
      suggestions: [],
    }


    this.onSearchChange = this.onSearchChange.bind(this);
    this.searchArtist = this.searchArtist.bind(this);
    this.closeAllLists = this.closeAllLists.bind(this);
    this.addActive = this.addActive.bind(this);
  }


  componentDidMount() {
    // Check if session cookie is present
    store.dispatch(isAuth());

    // close the suggestions list
    let self = this;
    document.addEventListener("click", function (e) {
      self.closeAllLists(e.target);
    });
  }

  static propTypes = {
    button: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
  };

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

    // TODO: fix only updating based on old state
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
      //a.style.display = "contents"
      a.style.position = "fixed"
      
      e.currentTarget.parentNode.appendChild(a);
      for (i = 0; i < this.state.suggestions.length; i++) {
        if (this.state.suggestions[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {

          b = document.createElement("DIV");
          b.style.backgroundColor = "rgb(255,255,255)";

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

  onComponentDidUpdate() {
    let e = document.getElementById("search");
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
    return (
       <div className="navbar-static-top navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Music Discovery</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            <li className="nav-item active">
                <Link className="nav-link" exact to="/">Home </Link>
            </li>

            <li className="nav-item active">
                <Link className="nav-link" exact to="/music">Music </Link>
            </li>

            {this.props.authState.isAuthenticated ? (
                <li className="nav-item">
                    <Link className="nav-link" exact to="/logout">Logout </Link>
                </li>
            ):
                <li className="nav-item">
                    <Link className="nav-link" exact to="/login">Login </Link>
                </li>
            }
            <li className="nav-item">
                <Link className="nav-link" exact to="/profile">Profile </Link>
            </li>
            <li className="nav-item">
            <form autocomplete="off" action="/">
          <div style={{float: "right", marginTop: "auto", marginBottom: "auto", marginLeft: "16px", marginRight: "16px"}} class="autocomplete">
            <input style={{border: "none",fontSize: "17px", padding: "6px", marginTop: "auto", marginBottom: "auto"}} id="search" type="text" name="search" placeholder="Search Artist.." onChange={this.onSearchChange}></input>
            <input style={{border: "none",fontSize: "17px", padding: "6px", marginTop: "auto", marginBottom: "auto"}} type="submit" value="Search Artist"></input>
          </div>
          
          </form>
          </li>
            </ul>
        </div>
        </div>
    )
  }
}
const mapStateToProps = (state) => ({ //Maps state to redux store as props
  authState: state.auth
});

export default connect(mapStateToProps)(NavBar);
