import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditableLabel from 'react-inline-editing';
import {BlockPicker } from 'react-color';
import ReactTooltip from "react-tooltip";
import {
  Tooltip,
} from 'react-tippy';

class Test extends Component {
  render() {
    return (<div className = "container ">
    <div className="list-group" style = {{marginBottom: 20}}>
      <div href="#" className="list-group-item flex-column align-items-start">
        <div className="d-flex w-100 justify-content-between">
          <h6>What's on this page</h6>
        </div>
        <small className="text-muted">
          <br/>* editing a task and saving it to Mongodb
          <br/>* color picker, trying to change an individual element in a list's color and saving that data
        </small>
      </div>
    </div>

    </div>);
  }
}


const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
)(Test);
