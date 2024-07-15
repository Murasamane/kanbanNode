const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ColumnSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: {
    type: String,
    required: [true, "Column must have a name"],
    minlength: [1, "Column name cannot be empty"],
  },
  tasks: {
    type: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    default: [],
  },
});

const Column = mongoose.model("Column", ColumnSchema);
module.exports = Column;
