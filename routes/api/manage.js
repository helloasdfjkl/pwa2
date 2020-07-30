const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

//Gets a user's tasks from the list that they're currently viewing
router.get("/getTasks", (req, res, next) => {
  let email = req.query.email;
  let listName = req.query.listName;
  User.findOne({ email: email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    else {
      //console.log(user.todoList);
      let lists = user.todoList;
      let foundList = lists.find(list => list[0] == listName), name = foundList[0], tasks = foundList.splice(1);
      //console.log("foundList: " + foundList + " name: " + name + " tasks:"  + tasks);
      res.send({list: tasks});
    }
  });
})
//Gets all the user's lists
router.get("/getLists", (req, res, next) => {
  let email = req.query.email;
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    else {
      console.log("hello??:" +  user.todoList);
      res.send({list: user.todoList});
    }
  });
})
//Adds a task to a list using the Add button
router.post("/addTask", (req, res) => {
  const {task, deadline, email, listName} = req.body;
  if(task.length != 0) {
  User.findOne({ email: email }).then(user => {
    let lists = user.todoList, foundList = lists.find(list => list[0] == listName), temp = foundList;
    temp.push([task, deadline, 0, "#ffffff"]);
    user.todoList.pull(foundList);
    user.todoList.push(temp);
    user.save(function(err, updatedUser) {
      if(err) {
        console.log(err);
        res.status(500).send();
      } else {
        //console.log("updated user: " + updatedUser + updatedUser.todoList)
      }
    })
  });}
});
//Delete a task from a list using the Delete button
router.post("/deleteTask", (req, res) => {
  const {task, index, email, listName} = req.body;

  User.findOne({email: email}).then(user => {
    let lists = user.todoList, foundList = lists.find(list => list[0] == listName), temp = foundList;
    console.log("removing index " + index + " value " + temp[index]);
    temp.splice(index, 1);
    //console.log("temp: " + temp)
    user.todoList.pull(foundList);
    user.todoList.push(temp);
    user.save(function(err, updatedUser) {
      if(err) {
        console.log(err);
        res.status(500).send();
      }
    })
  })
})
//Creates a new list for the user
router.post("/createList", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  console.log(name + " to be created has been received");

  User.findOne({email: email}).then(user => {
    user.todoList.push([name]);
    user.save(function(err, updatedUser) {
      if(err) {
        console.log(err);
        res.status(500).send();
      }
    })
  })
})
//Deletes an existing list for the user
router.post("/deleteList", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  console.log(name + " to be deleted has been received");

  User.findOne({email: email}).then(user => {
    let lists = user.todoList, foundList = lists.find(list => list[0] == name);
    user.todoList.pull(foundList);
    user.save(function(err, updatedUser) {
      if(err) {
        console.log(err);
        res.status(500).send();
      }
    })
      console.log("deleted");
  })
})
//Edits a task
router.post("/editText", (req, res) => {
  const {user, listName, task, type, email, index } = req.body;
  User.findOne({email:email}).then(user => {
    let lists = user.todoList, foundList = lists.find(list => list[0] == listName), temp = foundList;
    temp.splice(parseInt(index, 10)+1, 1, task);
    user.todoList.pull(foundList);
    user.todoList.push(temp);
    user.save(function(err, updatedUser) {
      if(err) {
        console.log(err);
        res.status(500).send();
      }
    })
  })
})
//adds a subtask to a task
router.post("/addSubtask", (req, res) => {
  const {subtask, email, listName, type,  index} = req.body;
  console.log(subtask + " at location " + index + " to be grouped has been reecived");

  User.findOne({email: email}).then(user => {
    let lists = user.todoList, foundList = lists.find(list => list[0] == listName), temp = foundList;
    //console.log("removing index " + index + " value " + temp[index]);
    let taskhead = temp[index];
    taskhead.push([subtask, "Due: ", 0]);
    temp.splice(index, 1, taskhead);
    //console.log("temp: " + temp)
    user.todoList.pull(foundList);
    user.todoList.push(temp);
    user.save(function(err, updatedUser) {
      if(err) {
        console.log(err);
        res.status(500).send();
      }
    })
  })
})

module.exports = router;
