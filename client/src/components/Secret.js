import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  Button,
  Card,
 CardTitle,
  CardBody
} from "reactstrap";
import PropTypes from "prop-types";
import './style.css';
import { logout, getSecret, isAuth } from '../actions/authActions';
import { buttonReset} from '../actions/uiActions';
import axios from "axios";

export class Secret extends Component {

  static propTypes = {
    button: PropTypes.bool,
    authState: PropTypes.object.isRequired,
    buttonReset: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = { secret: "" }
  }

  componentDidMount() {
    axios
  .get("/api/users/secret",{withCredentials:true})
  .then((res) =>
    {
        console.log(res.data);
        this.setState({ secret: res.data.secret });
    }
  )
  .catch((err) => {
});

    // const secret_ = this.props.isAuth();//this.props.getSecret();
    // console.log(secret_);
    // console.log("blah");
    // this.setState({ secret: secret_ });
  }

  onLogout = (e) => {
    e.preventDefault();
    this.props.buttonReset();
    this.props.logout();
  };

  render() {


    const {user} = this.props.authState;

    return (
       <div className="container">
        <div className="main">
          <Card>
            <CardBody>
          <CardTitle><h1>{ user ? `Welcome, ${user.name} `: ''} <span role="img" aria-label="party-popper">🎉 </span> </h1></CardTitle>
          <br/>
           Secret is {this.state.secret}
          <br/>
        <Button size="lg" onClick={this.onLogout} color="primary">Logout</Button>
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

export default connect(mapStateToProps, { logout, buttonReset, getSecret, isAuth })(Secret);
