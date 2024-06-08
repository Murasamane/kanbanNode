const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Board must have a name"],
    unique: true,
  },
  columns: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }],
    default: [],
  },
});

const Board = mongoose.model("Board", BoardSchema);

module.exports = Board;
