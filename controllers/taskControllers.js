const Subtask = require("../models/SubtaskModel");
const Task = require("../models/TaskModel");
const Column = require("../models/ColumnModel");

exports.updateTask = async (req, res) => {
  try {
    const { subtasks, ...taskData } = req.body;
    let task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        status: "failed",
        message: "Task not found",
      });
    }

    // Save a snapshot of the current task
    const oldTask = { ...task._doc };

    // Update the task's title and description
    task.title = taskData.title;
    task.description = taskData.description;

    // Find subtasks to remove
    const subtasksToRemove = oldTask.subtasks.filter(
      (subtaskId) => !subtasks.map((subtask) => subtask._id).includes(subtaskId)
    );

    // Remove subtasks from Subtask collection
    await Subtask.deleteMany({ _id: { $in: subtasksToRemove } });

    // Add new subtasks
    const subtaskIds = await Promise.all(
      subtasks.map(async (subtask) => {
        let newSubtask;
        if (subtask._id) {
          newSubtask = await Subtask.findByIdAndUpdate(subtask._id, subtask, { new: true });
        } else {
          newSubtask = new Subtask(subtask);
          await newSubtask.save();
        }
        return newSubtask._id;
      })
    );

    // Update the task's subtasks
    task.subtasks = subtaskIds;
    await task.save();

    // Fetch the updated task
    const updatedTask = await Task.findById(req.params.taskId);

    res.status(201).json({
      status: "success",
      data: {
        task: updatedTask,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};


exports.createNewTask = async (req, res) => {
  try {
    const { title, description, status, subtasks } = req.body;

    const subtaskIds = await Promise.all(
      subtasks.map(async (subtask) => {
        const newSubtask = new Subtask(subtask);
        await newSubtask.save();
        return newSubtask._id;
      })
    );
    const newTask = new Task({
      title,
      description,
      status,
      subtasks: subtaskIds,
    });
    await newTask.save();

    const column = await Column.findByIdAndUpdate(
      req.params.columnId,
      { $push: { tasks: newTask._id } },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "successfully created the task",
      data: {
        task: newTask,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) throw new Error("Task not found");
    await Subtask.deleteMany({ _id: { $in: task.subtasks } });

    await Task.findByIdAndDelete(req.params.taskId);

    const column = await Column.findByIdAndUpdate(
      req.params.columnId,
      { $pull: { tasks: req.params.taskId } },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      status: "success",
      message: "Successfully deleted the task",
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};
