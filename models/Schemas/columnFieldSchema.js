const mongoose = require("mongoose");
const TaskFieldSchema = require("./taskFieldSchema");
const Schema = mongoose.Schema;

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

module.exports = ColumnFieldSchema;
