import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

export const addTask = (taskData, history) => dispatch => {
  console.log("task data: " + taskData.task + " " + taskData.deadline)
  axios
    .post("/api/manage/addTask", taskData)
    .catch(err =>
      console.log(err)
    )
}

export const deleteTask = (taskData, history) => dispatch => {
  //console.log("task data: " + taskData.task + " " + taskData.deadline + " " + taskData.email)
  axios.post("/api/manage/deleteTask", taskData)
  .catch(err => console.log(err))
}

export const createList = (listData, history) => dispatch => {
  console.log('createList called');
  axios.post("/api/manage/createList", listData)
  .catch(err => console.log(err))
}

export const deleteList = (listData, history) => dispatch => {
  console.log("list to delete data is " + listData.name);
  axios.post("/api/manage/deleteList", listData)
  .catch(err => console.log(err))
}

export const changeTaskBackgroundColor = (taskData, history) => dispatch => {
  console.log(taskData.color + " " + taskData.task);
}
export const editText = (taskData, history) => dispatch => {
  console.log("index is " + taskData.index);
  axios.post("/api/manage/editText", taskData)
  .catch(err => console.log(err))
}

export const addSubtask = (subtaskData, history) => dispatch => {
  console.log("subtask to add: " + subtaskData.subtask + " of task " + subtaskData.index)
  if(subtaskData.subtask != "") {
    axios.post("/api/manage/addSubtask", subtaskData)
    .catch(err => console.log(err))
  }
}
export const markComplete = (taskData, history) => dispatch => {
  axios.post("/api/manage/editText", taskData)
  .catch(err => console.log(err))
}
