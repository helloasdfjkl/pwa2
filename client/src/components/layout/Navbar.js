import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    return (
      <nav style = {{marginBottom: 20}} className="navbar navbar-expand-lg navbar-light bg-light">
        <Link
          to="/dashboard"
          className="col s5 brand-logo center black-text navbar-brand"
        >
          MERN Stack App
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor02">
          <ul className="navbar-nav mr-auto">
            <li className = "nav-item">
              <Link to = "/dashboard" className="nav-link">
                Landing~~
              </Link>
            </li>
            <li className = "nav-item">
              <Link to="/manage/todotab" className = "nav-link">
                To Do Lists
              </Link>
            </li>
            <li className = "nav-item">
              <button style = {{padding: 7}}className = "btn nav-link" onClick={this.onLogoutClick}>
                Log Out
              </button>
            </li>
            <li className = "nav-item">
              <Link to="/profile" className = "nav-link">
                Profile
              </Link>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="text" placeholder="Search"/>
            <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
