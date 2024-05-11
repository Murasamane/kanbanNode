const Board = require("../models/boardModel");

exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find();

    res.status(200).json({
      status: "success",
      data: {
        boards,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

