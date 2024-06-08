const express = require("express");
const boardControllers = require("../controllers/boardControllers");

const {
  getAllBoards,
  getBoard,
  createBoard,
  createNewTask,
  deleteTask,
  updateSubTask,
  deleteBoard,
  updateBoard,
  updateTask,
  getBoardsInfo,
  getColumnsList,
  updateTaskLocation,
} = boardControllers;
const router = express.Router();

router.route("/").get(getAllBoards).post(createBoard);
router.route("/boardLinks").get(getBoardsInfo);
router.route("/:id").get(getBoard).put(updateBoard).delete(deleteBoard);
router.route("/:id/columnInfo").get(getColumnsList);
router.route("/tasks/:columnId?/:taskId").patch(updateTask).delete(deleteTask);
router.route("/create-task/:columnId").post(createNewTask);
router
  .route("/:id/changeColumn/:columnId/:taskId/:destinationColumnId")
  .patch(updateTaskLocation);
router.route("/update-subtask/:taskId/:subtaskId").patch(updateSubTask);

module.exports = router;
