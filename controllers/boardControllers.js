const Task = require("../models/taskModel");
const Column = require("../models/columnModel");
const Board = require("../models/boardModel");

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

exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    const { name, columns } = req.body;

    const oldColumns = board.columns.map((col) => col);

    const columnsOldFind = await Column.find({ _id: { $in: oldColumns } });
    const filteredCols = columns.filter(
      (col) =>
        !columnsOldFind.some(
          (col2) => col2._id.toString() === col._id.toString()
        )
    );

    const newColumnsToCreate = filteredCols.map((obj) => ({
      name: obj.name,
      tasks: [],
    }));

    const newColumns = [];

    for (const col of newColumnsToCreate) {
      let column = await Column.create(col);
      await column.save();
      const { _id } = column;
      newColumns.push(_id);
    }

    const savedCols = columnsOldFind.filter((obj) =>
      columns.some((obj2) => obj._id.toString() === obj2._id.toString())
    );

    const columnsToDelete = columnsOldFind.filter(
      (oldCol) => !savedCols.some((col) => col._id === oldCol._id)
    );

    const deletionColumns = await Column.find({
      _id: { $in: columnsToDelete },
    });

    for (const col of columns) {
      for (const safeCol of savedCols) {
        if (
          col._id.toString() === safeCol._id.toString() &&
          col.name !== safeCol.name
        ) {
          const column = await Column.findByIdAndUpdate(safeCol._id, {
            $set: { name: col.name },
          });

          for (task of column.tasks) {
            await Task.findByIdAndUpdate(task._id, {
              $set: { status: col.name },
            });
          }
        }
      }
    }

    for (const col of deletionColumns) {
      const colTasks = col.tasks;
      for (const task of colTasks) {
        await Task.findByIdAndDelete(task._id);
      }
      await Column.findByIdAndDelete(col._id);
    }
    await Board.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { columns: { $in: columnsToDelete } },
        $set: { name: name },
      },
      { new: true, runValidators: true }
    );

    await Board.findByIdAndUpdate(
      req.params.id,
      {
        $push: { columns: { $each: newColumns } },
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      status: "success",
      data: {
        newColumns,
        deletionColumns,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
      error: err,
    });
  }
};

exports.createBoard = async (req, res) => {
  try {
    const { name, columns } = req.body;

    const columnIds = [];
    for (const col of columns) {
      const newCol = await Column.create(col);
      columnIds.push(newCol._id);
    }

    const board = await Board.create({
      name: name,
      columns: columnIds,
    });
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
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) throw new Error("Board not found");

    const columns = board.columns;

    for (const col of columns) {
      const column = await Column.findById(col);
      const colTasks = column.tasks;

      for (const task of colTasks) {
        await Task.findByIdAndDelete(task);
      }
      await Column.findByIdAndDelete(col);
    }

    await Board.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      message: "Board deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
      error: err,
    });
  }
};

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
