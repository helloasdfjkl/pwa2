import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addTask, deleteTask,changeTaskBackgroundColor, editText, addSubtask, markComplete } from "../../actions/manageActions";
import { Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditableLabel from 'react-inline-editing';
import {BlockPicker } from 'react-color';
import ReactTooltip from "react-tooltip";
import "./extra/EditableLabel.css"

import {
  Tooltip,
} from 'react-tippy';

import { FaList, FaTrash, FaEdit, FaPaintBrush, FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';

class ToDo extends Component {
  constructor() {
    super();
    var today = new Date();
    //for editing at task
    this._handleFocus = this._handleFocus.bind(this);
    this._handleFocusOut = this._handleFocusOut.bind(this);

    this.state = {
      //defined in componentDidMount
      todoList: [],
      listLength: "",
      //basic task functions
      taskToAdd: "",
      deadline: today,
      startDate: new Date(),
      //color
      editing: '', //lowkey doesn't work
      hookElement: false,
      colors: [],
      background: '#fff',
      //tooltips!
      tooltipContent: '',
      //multi-use
      isEditingText: false,
      indexForEditingElement: -1,
      indexForCreatingSubtask: -1,
      hookSubtaskElement: false,
      newSubtask: '',
      tester: 'edit me',
      completed: false,

      errors: {},
    };
  }

  componentDidMount() {
    const { user } = this.props.auth;
    const listName = this.props.location.state.name;
    //console.log("Current list: " + listName);
    axios
    .get("/api/manage/getTasks", {params: {email: user.email, listName: listName }})
    .then(res => {
      this.setState({todoList: res.data.list, listLength: res.data.list.length})})
    .catch(error => {
      console.log(error.response)
    })
  }

  //COLOR!!!!
  handleChangeComplete = (color) => {
   this.setState({ background: color.hex });
   console.log("changed color of task " + this.state.editing + " to " + this.state.background)
   const taskData = {
     color: this.state.background,
     task: this.state.editing,
     listName: this.props.location.state.name,
     email: this.props.auth.user.email
   }
   this.props.changeTaskBackgroundColor(taskData);
 };

  _handleFocus(text) {
      console.log('Focused with text: ' + text + "at index " + this.state.indexForEditingElement);
  }

  _handleFocusOut(text) {
    const {user} = this.props.auth;
    console.log('Left editor with text: ' + text);
    let listName = this.props.location.state.name;
    let hookElement = this.state.hookElement;
    this.setState({hookElement: false})
    const taskData = {
      listName: listName,
      text: text,
      //type: 0-task 1-deadline
      type: 0,
      email: user.email,
      index: this.state.indexForEditingElement
    }
    this.props.editText(taskData);
    window.location.reload();
  }

  handleChange = date => {
    this.setState({
      deadline: date
    });
  };

  //BASIC
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value});
  }

  //BASIC TASK FUNCTIONS
  addTask = e => {
    e.preventDefault();
    const { user } = this.props.auth, listName = this.props.location.state.name;
    const taskData = {
      task: this.state.taskToAdd,
      deadline: this.state.deadline,
      email: user.email,
      listName: listName
    };
    console.log("Adding " + taskData.task + " " + taskData.deadline + " " + user.email + " " + listName)
    this.props.addTask(taskData);
    window.location.reload();
  }
  deleteTask = e => {
    const {user} = this.props.auth, listName = this.props.location.state.name;
    e.preventDefault();
    // console.log("NAME: " + e.target.name);
    //console.log("INDEX: " + e.target.id);
    this.props.deleteTask([e.target.name, e.target.id, user.email, listName]);
    window.location.reload();
  }

  //SUBTASKS
  createSubtask = e => {
    e.preventDefault();
    let {hookSubtaskElement, indexForCreatingSubtask, newSubtask} = this.state;
    if(indexForCreatingSubtask != -1 && indexForCreatingSubtask != e.target.id) {
      this.setState({indexForCreatingSubtask: e.target.id, newSubtask: ''})
    }
    else if(hookSubtaskElement) {
      console.log("is already creating subtask at index" + indexForCreatingSubtask);
      const {user} = this.props.auth, listName = this.props.location.state.name;
      const subtaskData = {
        email: user.email,
        listName: listName,
        subtask: this.state.newSubtask,
        index: parseInt(indexForCreatingSubtask,10) +1,
        type: 0
      }
      this.props.addSubtask(subtaskData);
      window.location.reload();
    } else {
      this.setState({hookSubtaskElement: true, indexForCreatingSubtask: e.target.id});
    }
  }
  closeCreateSubtask = e => {
    e.preventDefault();
    let {hookSubtaskElement, indexForCreatingSubtask} = this.state;
    this.setState({hookSubtaskElement: false, indexForCreatingSubtask: -1})
  }

  //TO EDIT A TASK
  //text
  edit = e => {
    e.preventDefault();
    console.log(e.target.id);
    let {indexForEditingElement, isEditingText, tester} = this.state;
    this.setState({isEditingText: true, indexForEditingElement: e.target.id, tester: e.target.name});
  }
  onEdit = e => {
    this.setState({ [e.target.name]: e.target.value});
  }
  saveEdit = e => {
    e.preventDefault();
    const {user} = this.props.auth, listName = this.props.location.state.name;
    let {tester, isEditingText, todoList, indexForEditingElement} = this.state;
    let task = todoList[indexForEditingElement];
    task.splice(0, 1, tester)
    const taskData = {
      listName: listName,
      task: task,
      type: 0,
      email: user.email,
      index: this.state.indexForEditingElement
    }
    todoList.splice(parseInt(indexForEditingElement, 10), 1, task);
    this.setState({isEditingText: false})
    this.props.editText(taskData);
  }
  //checklist
  markComplete = e => {
    e.preventDefault();
    const {user} = this.props.auth, listName = this.props.location.state.name;
    let index = e.target.id, todoList = this.state.todoList, task = todoList[index];
    let name = task[0], deadline = task[1], isComplete = task[2];
    console.log("task to mark complete: " + task + " at index " + index + " is marked " + isComplete  )
    if(todoList[index][2] == 0) {
      this.setState({completed: true})
      task.splice(2, 1, 1);
      todoList.splice(parseInt(index, 10), 1, task)
    }
    else {
      this.setState({completed: false})
      task.splice(2, 1, 0);
      todoList.splice(parseInt(index, 10), 1, task)
    }
    const taskData = {
      email: user.email,
      listName: listName,
      task: task,
      index: e.target.id,
    }
    this.props.markComplete(taskData);
  }
  //color
  getElementToBeEdited = e => {
    let {editing, hookElement} = this.state;
    e.preventDefault();
    this.setState({editing: e.target.name})
    console.log('now editing ' + editing)
  }
  hookElement = e => {
    let {editing, hookElement} = this.state;
    e.preventDefault();
    this.setState({ hookElement: true, indexForEditingElement: e.target.id});
    console.log('now editing ' + editing + 'at index ' + e.target.id);
  }
  render() {
    const { user } = this.props.auth;
    let list = this.state.todoList;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <div href="#" className="list-group-item flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <h6>Bugs/todo on this page :p</h6>
              </div>
              <small className="text-muted">
                <br/>* FIX DATES!!! []
                <br/>* add invalid alert when user tries to add a blank task []
              </small>
            </div>

            <div >
              <form className = "col-6 mx-auto" onSubmit = {this.addTask}>
                <div className = "input-group">
                  <input
                    autocomplete="off"
                    onChange = {this.onChange}
                    type = "text"
                    className = "form-control"
                    name = "taskToAdd"
                    placeholder = "Enter Task"
                    value = {this.state.taskToAdd}
                  />
                  <DatePicker
                    className = "form-control"
                    selected={this.state.deadline}
                    onChange={this.handleChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                  <span>
                    <button type = "submit" className = "btn btn-primary">Add</button>
                  </span>
                </div>
              </form>
            </div>
            {list.length ? (
              <table className = "table table-hover">
                <thead>
                  <tr>
                    <th></th>
                    <th>Task</th>
                    <th>Deadline</th>
                    <th>Options</th>
                  </tr>
                </thead>
                {list.map((task, index) => {
                  return(
                    <tbody>
                      {task[2] == 1 ? <tr className = "table-success">
                        <td>
                            <form name = {task} id = {index} onSubmit = {this.markComplete}>
                            <button style = {{ padding: 0,border: 'none',background: 'none'}}>
                              <i><FaCheckCircle/></i>
                            </button>
                            </form>
                        </td>
                        <td>
                        {this.state.isEditingText && this.state.indexForEditingElement == index ? (<div>
                          <input onChange = {this.onEdit}
                            type = "text"
                            name = "tester"
                            value = {this.state.tester}
                          />
                          <button className = "btn btn-sm btn-danger" onClick = {this.saveEdit}>Ok</button>
                        </div>)
                        :
                        <button
                          style = {{padding: 0, border: 'none', background: 'none'}}
                          name = {task[0]}
                          id = {index}
                          onClick = {this.edit}>
                          {task[0]}
                        </button>
                        }
                        </td>
                        <td>{task[1]}</td>
                        <td>
                          <div style = {{display: 'flex'}}>
                            <form style = {{marginRight: 10}} name = {task[0]} id = {index} onSubmit = {this.deleteTask}>
                            <button data-tip = "Delete Task" className="btn-sm btn btn-outline-danger" >
                              <i><FaTrash/></i>
                              <ReactTooltip/>
                            </button>
                            </form>
                            <Tooltip
                              name = {task[0]}
                              trigger="click"
                              interactive
                              position = "bottom"
                              html={(
                                <div>
                                  <p>{this.state.tooltipContent}</p>
                                  <BlockPicker color={ this.state.background }
                                 onChangeComplete={ this.handleChangeComplete }/>
                                </div>
                              )}>
                              <form style = {{marginRight: 10}} name = {task[0]} onSubmit = {this.hookElement}>
                                <button name = {task[0]} onClick = {this.getElementToBeEdited} data-tip = "Change Theme" className="btn-sm btn btn-outline-danger" >
                                  <i><FaPaintBrush/></i>
                                  <ReactTooltip/>
                                </button>
                              </form>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>:<tr>
                        <td>
                          {task[2] == 1 ?
                            <form name = {task} id = {index} onSubmit = {this.markComplete}>
                            <button style = {{ padding: 0,border: 'none',background: 'none'}}>
                              <i><FaCheckCircle/></i>
                            </button>
                            </form>
                            :
                            <form name = {task} id = {index} onSubmit = {this.markComplete}>
                            <button style = {{ padding: 0,border: 'none',background: 'none'}} >
                              <i><FaRegCheckCircle/></i>
                            </button>
                            </form>
                          }
                        </td>
                        <td>
                        {this.state.isEditingText && this.state.indexForEditingElement == index ? (<div>
                          <input onChange = {this.onEdit}
                            type = "text"
                            name = "tester"
                            value = {this.state.tester}
                          />
                          <button className = "btn btn-sm btn-danger" onClick = {this.saveEdit}>Ok</button>
                        </div>)
                        :
                        <button
                          style = {{padding: 0, border: 'none', background: 'none'}}
                          name = {task[0]}
                          id = {index}
                          onClick = {this.edit}>
                          {task[0]}
                        </button>
                        }
                        </td>
                        <td>{task[1]}</td>
                        <td>
                          <div style = {{display: 'flex'}}>
                            <form style = {{marginRight: 10}} name = {task[0]} id = {index} onSubmit = {this.deleteTask}>
                            <button data-tip = "Delete Task" className="btn-sm btn btn-outline-danger" >
                              <i><FaTrash/></i>
                              <ReactTooltip/>
                            </button>
                            </form>
                            <Tooltip
                              name = {task[0]}
                              trigger="click"
                              interactive
                              position = "bottom"
                              html={(
                                <div>
                                  <p>{this.state.tooltipContent}</p>
                                  <BlockPicker color={ this.state.background }
                                 onChangeComplete={ this.handleChangeComplete }/>
                                </div>
                              )}>
                              <form style = {{marginRight: 10}} name = {task[0]} onSubmit = {this.hookElement}>
                                <button name = {task[0]} onClick = {this.getElementToBeEdited} data-tip = "Change Theme" className="btn-sm btn btn-outline-danger" >
                                  <i><FaPaintBrush/></i>
                                  <ReactTooltip/>
                                </button>
                              </form>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>}
                      <tr>
                        <td style = {{width: 200}}>
                          <form name = {task[0]} id = {index} onSubmit = {this.createSubtask}>
                            <button type = "submit" className="btn-sm btn-primary btn btn-danger" >
                              <p style = {{marginBottom: 0}}>+ Add Subtask</p>
                            </button>
                          </form>
                          {this.state.hookSubtaskElement && index == this.state.indexForCreatingSubtask ? (
                            <div style = {{display: 'flex'}}>
                              <form onSubmit={e => { e.preventDefault()}} style = {{border: 'none'}}>
                                <input style = {{}} autocomplete="off"
                                  onChange = {this.onChange}
                                  type = "text"
                                  className = "form-control"
                                  placeholder = "newName"
                                  name = "newSubtask"
                                  value = {this.state.newSubtask}
                                />
                              </form>
                              <button onClick = {this.closeCreateSubtask} className = "btn btn-sm">X</button>
                            </div>
                          ) : null}</td>
                        <td>
                        {task.length > 3 ? (
                          <div>
                            <ul>
                              {task.map((subtask, index) => {
                                return(<div>{index >= 3 ? (<li>{subtask[0]}</li>) : null }</div>)
                              })}
                            </ul>
                          </div>
                        ) : null}
                        </td>
                        <td>
                        {task.length > 3 ? (
                          <div>
                            <ul>
                              {task.map((subtask, index) => {
                                return(<div>{index >= 3 ? (<li>{subtask[1]}</li>) : null }</div>)
                              })}
                            </ul>
                          </div>
                        ) : null}
                        </td>
                      </tr>
                    </tbody>
                  )
                })}
              </table>) : null}
          </div>
        </div>
      </div>
    );
  }
}

ToDo.propTypes = {
  addTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  addSubtask: PropTypes.func.isRequired,
  markComplete: PropTypes.func.isRequired,
  editText: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  changeTaskBackgroundColor: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addTask, deleteTask, editText, changeTaskBackgroundColor, addSubtask, markComplete}
)(ToDo);
