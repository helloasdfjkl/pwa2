import React, { Component } from "react";
import {Link, withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, changeProfile } from "../../actions/authActions";
import classnames from "classnames";

import { FaUser} from 'react-icons/fa';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      oldpassword: '',
      password:'',
      password2:'',

      errors: {},
    };
  }

  componentDidMount() {
    const { user } = this.props.auth;
    this.setState({name: user.name, email: user.email})
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value});
  }

  onChangeProfile = e => {
    e.preventDefault();
    const {user} = this.props.auth;
    const newPassword = {
      name: this.state.name,
      email: user.email,
      oldpassword: this.state.oldpassword,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.changeProfile(newPassword, this.props.history);
  }

  render() {
    const {errors} = this.state;
    const {user} = this.props.auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div  className="col s12 center-align">
            <div style = {{float: 'left', width: '60%'}}>
              <h3>Hi {user.name.split(" ")[0]}</h3>
              <p style = {{fontSize: 18}}>Profile Settings</p>
              <div style = {{display: 'flex'}}><p style = {{width: '40%', padding: 12}}>Name</p>
              <input
                autocomplete="off"
                onChange = {this.onChange}
                type = "text"
                className = "form-control"
                name = "name"
                value = {this.state.name}
              /></div>
              <div style = {{display: 'flex'}}><p style = {{width: '40%', padding: 12}}>Email</p>
              <input disabled
                autocomplete="off"
                onChange = {this.onChange}
                type = "text"
                className = "form-control"
                name = "email"
                value = {this.state.email}
              /></div>
              <form noValidate onSubmit = {this.onChangeProfile}>
                <p style = {{fontSize: 18}}>Password</p>
                <div style = {{display: 'flex'}}><p style = {{width: '40%', padding: 12}}>Current password</p>
                <input
                  autocomplete="off"
                  onChange = {this.onChange}
                  type = "password"
                  className = {classnames("form-control", {invalid: errors.password || errors.passwordincorrect})}
                  name = "oldpassword"
                  value = {this.state.oldpassword}
                  errors = {errors.oldpassword}
                /></div>
                <span className="red-text">{errors.password || errors.passwordincorrect}</span>
                <div style = {{display: 'flex'}}><p style = {{width: '40%', padding: 12}}>New password</p>
                <input
                  autocomplete="off"
                  onChange = {this.onChange}
                  type = "password"
                  className = {classnames("form-control", {invalid: errors.password})}
                  name = "password"
                  value = {this.state.password}
                  errors = {errors.password}
                /></div>
                <span className="red-text">{errors.password}</span>
                <div style = {{display: 'flex'}}><p style = {{width: '40%', padding: 12}}>Confirm password</p>
                <input
                  autocomplete="off"
                  onChange = {this.onChange}
                  type = "password"
                  className = {classnames("form-control", {invalid: errors.password2})}
                  name = "password2"
                  errors = {errors.password2}
                /></div>
                <span className="red-text">{errors.password2}</span>
                <button type = "submit" style = {{float: 'right'}} className = "btn btn-sml btn-danger">Save</button>
                <span className="red-text">{errors.success}</span>
              </form>
            </div>
            <div style = {{float: 'right', width: '40%', textAlign: 'center'}}>
              <i><FaUser size = "9x" style = {{width: '50%', height: '50%', paddingTop: '25%'}}/></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  changeProfile: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { logoutUser, changeProfile }
)(Profile);
