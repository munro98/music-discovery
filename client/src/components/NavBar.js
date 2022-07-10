import React, { Component } from 'react';

import { connect } from "react-redux";
import { Link} from 'react-router-dom'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap';
import PropTypes from "prop-types";
import './style.css';
import store from '../store';
import { isAuth } from '../actions/authActions'

import {CHANGE_ARTIST} from '../reducers/musicReducer';

import './appstyles.css';

export class NavBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      artistName: "",
      suggestions: [],
      isOpen: false
    }

    this.searchInput = "";


    this.onSearchChange = this.onSearchChange.bind(this);
    this.searchArtist = this.searchArtist.bind(this);
    this.closeAllLists = this.closeAllLists.bind(this);
    this.addActive = this.addActive.bind(this);
    this.toggle = this.toggle.bind(this);
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
    this.searchInput = e.currentTarget.value;
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
      a.setAttribute("className", "autocomplete-items");
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
                
                
                self.searchInput = this.getElementsByTagName("input")[0].value;
                console.log("inp = " + self.searchInput );

              /*close the list of autocompleted values,*/
              self.closeAllLists();
          });
          a.appendChild(b);
        }
      }

  }

  onSubmit = (e) => {
    e.preventDefault();

    console.log("Searching " + this.searchInput);
    if (this.searchInput.length > 0) {
      this.props.changeArtist(this.searchInput);
      let imePesme = this.searchInput.replace(/&/g, '%26');
        //window.history.pushState("", 'Music', "/music/?artist="+imePesme);
        this.props.navigation("/music/?artist="+imePesme)
    }
    this.closeAllLists();
    
    //this.props.login(user);
  };

  onLogout = (e) => {
    e.preventDefault();
    this.props.buttonReset();
    this.props.logout();
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onComponentDidUpdate() {
    console.log(this.props.music.selectedArtist)
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
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Music Discovery</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link className="nav-link" exact to="/">Home </Link>
              </NavItem>
              {this.props.authState.isAuthenticated ? (
                <NavItem>
                < Link className="nav-link" exact to="/logout">Logout </Link>
                </NavItem>
              ):
                <NavItem>
                  <Link className="nav-link" exact to="/login">Login </Link>
                </NavItem>
              }
              {this.props.authState.isAuthenticated ? (
                <NavItem>
                <Link className="nav-link" exact to="/profile">Profile </Link>
              </NavItem>
              ):
              <NavItem>
              <Link className="nav-link" exact to="/register">Register </Link>
            </NavItem>
              }
              
              <NavItem>
              <form class="form-inline my-2 my-lg-0" autoComplete="off" onSubmit={this.onSubmit}>
              <div style={{float: "right", marginTop: "auto", marginBottom: "auto", marginLeft: "16px", marginRight: "16px"}} class="autocomplete">
                <input style={{border: "none",fontSize: "17px", padding: "6px", marginTop: "auto", marginBottom: "auto"}} id="search" type="text" name="search" placeholder="Search Artist.." onChange={this.onSearchChange}></input>
                <input style={{border: "none",fontSize: "17px", padding: "6px", marginTop: "auto", marginBottom: "auto"}} type="submit" value="Search Artist"></input>
              </div>
              
              </form>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({ //Maps state to redux store as props
  authState: state.auth,
  music: state.music
});
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      changeArtist: artist => {
        dispatch({
          type: CHANGE_ARTIST,
          payload: artist
        })
    }
  }
}

const changeArtist = ( artistName) => (dispatch) => {
  console.log("dispatching " + artistName);
  
  dispatch({
    type: CHANGE_ARTIST,
    payload: artistName
  });
};

export default connect(mapStateToProps, {changeArtist})(NavBar);