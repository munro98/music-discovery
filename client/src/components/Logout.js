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
import './style.css';
import { Navigate } from 'react-router-dom'
import { logout, getSecret, isAuth } from '../actions/authActions';
import { buttonReset} from '../actions/uiActions';
import axios from "axios";

export class Logout extends Component {

  static propTypes = {
    button: PropTypes.bool,
    authState: PropTypes.object.isRequired,
    buttonReset: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.logout();
  }

  render() {
    if(!this.props.authState.isAuthenticated) {
        return <Navigate exact to="/" />
    }

    return (
       <div className="container">
        <div className="main">
          <Card>
            <CardBody>
          <CardTitle><h1> Logging out </h1></CardTitle>
          <br/>
           Please wait...
          <br/>
            </CardBody>
          </Card>
        </div>
    </div>
    )
  }
}
const mapStateToProps = (state) => ({ //Maps state to redux store as props
  button: state.ui.button,
  authState: state.auth
});

export default connect(mapStateToProps, { logout, isAuth })(Logout);
