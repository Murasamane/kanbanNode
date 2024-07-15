const express = require("express");
const TaskController = require("../controllers/taskControllers");
const router = express.Router();

const {
  updateSubTask,
  deleteTask,
  createNewTask,
  updateTaskLocation,
  updateTask,
} = TaskController;

router
  .route("/update-task/:columnId?/:taskId")
  .patch(updateTask)
  .delete(deleteTask);
router.route("/create-task/:columnId").post(createNewTask);
router
  .route("/change-column/:columnId/:taskId/:destinationColumnId")
  .patch(updateTaskLocation);
router.route("/update-subtask/:taskId/:subtaskId").patch(updateSubTask);

module.exports = router;
