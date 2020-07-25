const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String
  },
  deadline: {
    type: String
  }
});

const ToDoSchema= new Schema({
  name: {
    type: String,
  },
  tasks: {
    type: [TaskSchema],
  },
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  todoList: {
    type: [],
  },
});

module.exports = Task = mongoose.model("tasks", TaskSchema);
module.exports = ToDo = mongoose.model("todos", ToDoSchema);
module.exports = User = mongoose.model("users", UserSchema);
