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

exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) throw new Error("Board not found");
    res.status(200).json({
      status: "success",
      data: {
        board,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.createBoard = async (req, res) => {
  try {
    const board = await Board.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        board,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.createNewColumn = async (req, res) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          columns: {
            ...req.body,
          },
        },
      },
      { new: true, runValidators: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        board,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.createNewTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (title === "" || description === "")
      throw new Error("Name or Description is empty");

    const column = await Board.updateOne(
      { _id: req.params.id },
      {
        $push: {
          "columns.$[column].tasks": {
            ...req.body,
          },
        },
      },
      {
        arrayFilters: [{ "column._id": req.params.columnId }],
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      status: "success",
      message: "successfully created the task",
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.createSubTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (title === "") throw new Error("Name or Description is empty");

    const column = await Board.updateOne(
      { _id: req.params.id },
      {
        $push: {
          "columns.$[column].tasks.$[task].subtasks": {
            ...req.body,
          },
        },
      },
      {
        arrayFilters: [
          { "column._id": req.params.columnId },
          { "task._id": req.params.taskId },
        ],
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      status: "success",
      message: "successfully created the subtask",
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const column = await Board.updateOne(
      { _id: req.params.id },
      {
        $pull: {
          "columns.$[column].tasks": {
            _id: req.params.taskId,
          },
        },
      },
      {
        arrayFilters: [{ "column._id": req.params.columnId }],
      }
    );

    res.status(201).json({
      status: "success",
      message: "successfully deleted the task",
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteColumn = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          columns: {
            name: req.params.columnName,
          },
        },
      }
    );
    res.status(201).json({
      status: "success",
      message: `Successfully deleted the column ${req.params.columnName}`,
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);

    if (!board) throw new Error("Board not found");
    res.status(201).json({
      status: "success",
      message: `Successfully deleted the Board`,
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};
