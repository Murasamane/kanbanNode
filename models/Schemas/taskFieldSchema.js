const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubtaskFieldSchema = require("./subtaskFieldSchema");

const TaskFieldSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  title: {
    type: String,
    required: [true, "Task must have a name"],
  },
  description: {
    type: String,
    required: [true, "Task must have a description"],
  },
  status: {
    type: String,
    required: [true, "Task must have a status"],
  },
  subtasks: {
    type: [SubtaskFieldSchema],
    default: [],
  },
});

module.exports = TaskFieldSchema;
