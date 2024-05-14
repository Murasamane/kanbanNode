const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubtaskFieldSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  title: {
    type: String,
    required: [true, "Subtask must have a title"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

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

const ColumnFieldSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: {
    type: String,
    required: [true, "Column must have a name"],
    minlength: [1, "Column name cannot be empty"],
  },
  tasks: {
    type: [TaskFieldSchema],
    default: [],
  },
});

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Board must have a name"],
    unique: true,
  },
  columns: {
    type: [ColumnFieldSchema],
    default: [],
  },
});

const Board = mongoose.model("Board", BoardSchema);

module.exports = Board;
