const Task = require("../models/taskModel");
const Column = require("../models/columnModel");

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    for (let key in req.body) {
      task[key] = req.body[key];
    }

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

exports.createNewTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    await Column.findByIdAndUpdate(
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

exports.updateTaskLocation = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const column = await Column.updateOne(
      { _id: req.params.columnId },
      {
        $pull: {
          tasks: task._id,
        },
      }
    );

    const destinationColumn = await Column.updateOne(
      { _id: req.params.destinationColumnId },
      {
        $push: {
          tasks: task._id,
        },
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
