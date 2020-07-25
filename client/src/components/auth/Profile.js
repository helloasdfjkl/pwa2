import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { logoutUser } from "../../actions/authActions";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      name: "",

      errors: {},
    };
  }

  componentDidMount() {
    const { user } = this.props.auth;
    this.setState({name: user.name})
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value});
  }
  
  render() {
    const {user} = this.props.auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h3>Hi {user.name.split(" ")[0]}</h3>
            <p style = {{fontSize: 18}}>Profile Settings</p>
            <p>Name</p>
            <input
              autocomplete="off"
              onChange = {this.onChange}
              type = "text"
              className = "form-control"
              name = "name"
              placeholder = "Enter Task"
              value = {this.state.name}
            />
            <p>Email</p>
            <p>Change password</p>
            <p>Confirm password</p>

          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Profile);
