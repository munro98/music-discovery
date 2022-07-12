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
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

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
    this.toggle = this.toggle.bind(this);

    this.handleOnSearch = this.handleOnSearch.bind(this);
    this.handleOnHover = this.handleOnHover.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.formatResult = this.formatResult.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  componentDidMount() {
    // Check if session cookie is present
    store.dispatch(isAuth());
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
        let s = suggestions.map( (element, index) => ({id: index, name: element}));
        this.setState({suggestions: s});
        //*/
      }).catch(err => {
        console.log('The request failed!!!! ' + err); 
      });
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

  handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    this.searchArtist(string);
    this.searchInput = string;
    console.log(string)
  }

  handleOnHover(result) {
    // the item hovered
    console.log(result)
  }

  handleOnSelect(item) {
    // the item selected
    this.searchInput = item.name;
    if (item.length > 0) {
      this.props.changeArtist(item.name);
      let imePesme = item.name.replace(/&/g, '%26');
        this.props.navigation("/music/?artist="+imePesme)
    }

    console.log(item)
  }

  formatResult(item){
    return (
      <>
        <span style={{ zIndex: '99',display: 'block', textAlign: 'left' }}>{item.name}</span>
      </>
    )
  }

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand style={{marginLeft: "6px"}} href="/">Music Discovery</NavbarBrand>
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
              
              <NavItem style={{width:"240px"}}>
              <ReactSearchAutocomplete
                styling={{ zIndex: '99'}}
                items={this.state.suggestions}
                onSearch={this.handleOnSearch}
                onHover={this.handleOnHover}
                onSelect={this.handleOnSelect}
                autoFocus
                formatResult={this.formatResult}
              />
              
              </NavItem>
              <NavItem style={{marginTop: "4px", marginLeft: "8px"}}>
              <form  autoComplete="off" onSubmit={this.onSubmit}>
              <input style={{ border: "none",fontSize: "17px", padding: "6px", marginTop: "auto", marginBottom: "auto"}} type="submit" value="Search Artist"></input>
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