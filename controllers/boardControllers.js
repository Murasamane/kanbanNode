const Task = require("../models/taskModel");
const Column = require("../models/columnModel");
const Board = require("../models/boardModel");

// Board

// Done
exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find().populate({
      path: "columns",
      populate: {
        path: "tasks",
      },
    });

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
// Done
exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate({
      path: "columns",
      populate: {
        path: "tasks",
      },
    });

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
// Done
exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    const { name, columns } = req.body;

    const oldColumns = board.columns.map((col) => col);

    const columnsOldFind = await Column.find({ _id: { $in: oldColumns } });
    const filteredCols = columns.filter(
      (col) => !columnsOldFind.some((col2) => col2._id === col._id)
    );

    const newColumnsToCreate = filteredCols.filter(
      (obj) => obj._id === undefined
    );

    const newColumns = newColumnsToCreate.map((colData) => {
      let column = new Column(colData);
      column.save();

      board.columns.push(column._id.toString());
      return column;
    });

    const savedCols = filteredCols.filter((obj) => obj._id !== undefined);
    const fullNewColumns = [...newColumns, ...savedCols];

    const columnsToDelete = columnsOldFind.filter(
      (oldCol) =>
        !fullNewColumns.some(
          (col) => col._id.toString() === oldCol._id.toString()
        )
    );

    const deletionColumns = await Column.find({
      _id: { $in: columnsToDelete },
    });

    for (const col of deletionColumns) {
      const colTasks = col.tasks;
      for (const task of colTasks) {
        await Task.findByIdAndDelete(task._id);
      }
      await Column.findByIdAndDelete(col._id);
    }
    await Board.findByIdAndUpdate(req.params.id, {
      $pull: { columns: { $in: columnsToDelete } },
      $set: { name: name },
    });

    board.save();

    res.status(201).json({
      status: "success",
      message: "board updated successfully",
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};
// Done
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

// Todo
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

// Done
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

// Task

// Done
exports.updateTask = async (req, res) => {
  try {
    // Find the task
    const task = await Task.findById(req.params.taskId);

    // Update the task fields based on req.body
    for (let key in req.body) {
      task[key] = req.body[key];
    }

    // Save the board
    await task.save();

    res.status(201).json({
      status: "success",
      message: "task updated successfully",
      task,
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};
// Done
exports.createNewTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    const column = await Column.findByIdAndUpdate(
      req.params.columnId,
      {
        $addToSet: {
          tasks: task._id,
        },
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
// Done
exports.deleteTask = async (req, res) => {
  try {
    await Column.updateOne(
      {
        _id: req.params.columnId,
      },
      {
        $pull: {
          tasks: req.params.taskId,
        },
      }
    );

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(201).json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};
// Done
exports.getColumnsList = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate(
      "columns",
      "_id name"
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
// Done
exports.updateSubTask = async (req, res) => {
  try {
    const { isCompleted } = req.body;

    await Task.updateOne(
      {
        _id: req.params.taskId,
        "subtasks._id": req.params.subtaskId,
      },
      {
        $set: {
          "subtasks.$[subtask].isCompleted": isCompleted,
        },
      },
      {
        arrayFilters: [{ "subtask._id": req.params.subtaskId }],
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

// Todo
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
