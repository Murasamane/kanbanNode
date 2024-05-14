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

module.exports = SubtaskFieldSchema;
