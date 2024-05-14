const mongoose = require("mongoose");
const ColumnFieldSchema = require("./Schemas/columnFieldSchema");

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
