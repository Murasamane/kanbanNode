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

exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
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

exports.updateTask = async (req, res) => {
  try {
    // Find the board
    const board = await Board.findById(req.params.id);

    // Find the column
    const column = board.columns.id(req.params.columnId);

    // Find the task
    const task = column.tasks.id(req.params.taskId);

    // Update the task fields based on req.body
    for (let key in req.body) {
      task[key] = req.body[key];
    }

    // Save the board
    await board.save();

    res.status(201).json({
      status: "success",
      message: "task updated successfully",
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
    const { title, description, status } = req.body;

    if (title === "" || description === "" || !title || !description || !status)
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
        arrayFilters: [{ "column.name": req.params.columnName }],
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

exports.getBoardsInfo = async (req, res) => {
  try {
    const boards = await Board.find({}, "_id name");

    res.status(200).json({
      status: "success",
      data: {
        boards,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getColumnsList = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).select(
      "name columns._id columns.name"
    );

    res.status(200).json({
      status: "success",
      data: {
        board,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.updateSubTask = async (req, res) => {
  try {
    const { isCompleted } = req.body;

    const column = await Board.updateOne(
      {
        _id: req.params.id,
        "columns._id": req.params.columnId,
        "columns.tasks._id": req.params.taskId,
        "columns.tasks.subtasks._id": req.params.subtaskId,
      },
      {
        $set: {
          "columns.$[column].tasks.$[task].subtasks.$[subtask].isCompleted":
            isCompleted,
        },
      },
      {
        arrayFilters: [
          { "column._id": req.params.columnId },
          { "task._id": req.params.taskId },
          { "subtask._id": req.params.subtaskId },
        ],
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "successfully updated the subtask",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateTaskLocation = async (req, res) => {
  try {
    console.log(req.params);
    const board = await Board.findById({ _id: req.params.id });
    const column = board.columns.id(req.params.columnId);
    const destinationColumn = board.columns.id(req.params.destinationColumnId);
    const task = column.tasks.id(req.params.taskId);

    const currentColumn = await Board.updateOne(
      { _id: req.params.id },
      {
        $pull: {
          "columns.$[column].tasks": task,
        },
      },
      {
        arrayFilters: [
          { "column._id": req.params.columnId },
          { "task._id": req.params.taskId },
        ],
      }
    );

    const newColumn = await Board.updateOne(
      { _id: req.params.id },
      {
        $push: {
          "columns.$[column].tasks": task,
        },
      },
      {
        arrayFilters: [{ "column._id": req.params.destinationColumnId }],
      }
    );
    res.status(200).json({
      message: "Successfull",
      data: {
        task,
      },
      column: {
        column,
      },
      destinationColumn: {
        destinationColumn,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};
