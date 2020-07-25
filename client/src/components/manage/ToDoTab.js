import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addTask, deleteTask, createList, deleteList } from "../../actions/manageActions";
import { Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class ToDoTab extends Component {
  constructor() {
    super();
    var today = new Date();
    this.state = {
      task: "",
      deadline: today,
      errors: {},
      todoList: [],
      startDate: new Date(),
      createList: false,
      newListName: '',
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value});
  }

  handleChange = date => {
    this.setState({
      deadline: date
    });
  };

  switchToList = e => {
    const {user} = this.props.auth;
    e.preventDefault();
    const data = {
      email: user.email,
      name: e.target.name
    }
    this.props.history.push(`/manage/todotab/${data.name}`, {email: data.email, name: data.name});
  }

  createList = e => {
    e.preventDefault();
    let {newListName, createList} = this.state;
    const {user} = this.props.auth;
    if(createList && newListName != "") {
      const listData = {
        email: user.email,
        name: newListName
      }
      this.props.createList(listData);
      window.location.reload();

    }
    this.setState({createList: true});
  }

  closeCreateList = () => {
    this.setState({createList: false});
  }

  deleteList = e => {
    const {user} = this.props.auth;
    const listData = {
      email: user.email,
      name: e.target.name
    }
    this.props.deleteList(listData);
  }

  componentDidMount() {
    const {user} = this.props.auth;
    axios
      .get("/api/manage/getLists", {params: {email:user.email}})
      .then(res => {
        this.setState({todoList: res.data.list})
        console.log("now " + this.state.todoList)})
      .catch(error => {
        console.log(error.response)
      })
  }

  render() {
    const {user} = this.props.auth;
    let list = this.state.todoList;
    let count = 0;

    return(
      <div className = "container ">
        <div className="list-group" style = {{marginBottom: 20}}>
          <div href="#" className="list-group-item flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
              <h3 className="mb-1">Manage Your Lists</h3>
              <small className="text-muted">3 days ago</small>
            </div>
            <small className="text-muted">View, edit, and create your lists. :)   </small>
            <div style = {{display: 'flex'}}>
              <button onClick = {this.createList} className="btn btn-sm btn-info">Create List</button>
              {this.state.createList ? (
                <div style = {{display: 'flex'}}>
                  <form  onSubmit={e => { e.preventDefault(); }} style = {{border: 'none'}}  >
                  <input autocomplete="off"
                    onChange = {this.onChange}
                    type = "text"
                    className = "form-control"
                    placeholder = "newName"
                    name = "newListName"
                    value = {this.state.newListName}
                  />
                  </form>
                  <button onClick = {this.closeCreateList} className = "btn btn-sm">X</button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="list-group" style = {{marginBottom: 20}}>
          <div href="#" className="list-group-item flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
              <h6>Bugs/todo on this page :p</h6>
            </div>
            <small className="text-muted">* clicking "To Do Lists" in nav again doesn't load the tasks
              <br/>* FIX DATES!!!
              <br/>*** dates should pop up according to how long ago a list was edited []
              <br/>*** there will be an ability to edit lists (list names, order, etc.) []
              <br/>*** option to order the lists by a certain filter (alphabetically, most recent, important, etc.) []
              <br/>* lists should load in horizontal not vertical order [x]
              <br/>* create list button should actually create a list & delete list button should exist [x]
              <br/>* there will be an ability to edit the color/theme of each list []
              <br/>* add confirmation alerts when adding/deleting things
            </small>
          </div>
        </div>
        {list.length ? (<div style = {{flexWrap: 'wrap', display: 'flex'}}>
          {list.map((card) => {
            let name = card[0];
            let tasks = card.splice(1);
            return(
            <div class="card border-primary mb-3" style = {{margin: "1%", width: "31%"}}>
              <form style = {{border: 'none'}} className = "card-header btn-sm btn btn-outline-primary" name = {name} onSubmit = {this.switchToList}>
                <button className = "btn-sm btn">
                  <div style = {{fontSize: 18}}>{name}</div>
                </button>
              </form>
              <div class="card-body">
                <p style = {{fontWeight: 'bold'}}>preview</p>
                <hr/>
                {tasks.length == 0 ? <div className = "text-muted">Nothing in here!</div> : <ul>{tasks.map((task) => {
                  let name = task[0];
                  return (
                    <li className = "text-muted" class="card-text">{name}</li>
                  )
                } )}</ul>}
              </div>
              <div class = "card-footer">
                <form name = {name} onSubmit = {this.deleteList}>
                  <button type = "submit" className = "btn-secondary btn-sm btn">Delete</button>
                </form>
              </div>
            </div>
          )})} </div>) : null }
        </div>

    )
  }
}

ToDoTab.propTypes = {
  addTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  createList: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addTask, deleteTask, createList, deleteList}
)(ToDoTab);
