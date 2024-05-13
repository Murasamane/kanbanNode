const express = require("express");
const boardControllers = require("../controllers/boardControllers");

const {
  getAllBoards,
  getBoard,
  createBoard,
  createNewColumn,
  createNewTask,
  deleteTask,
  deleteColumn,
  deleteBoard,
} = boardControllers;
const router = express.Router();

router.route("/").get(getAllBoards).post(createBoard);
router.route("/:id").get(getBoard).post(createNewColumn).delete(deleteBoard);
router.route("/:id/:columnName").post(createNewTask).delete(deleteColumn);
router.route("/:id/:columnName/:taskId").delete(deleteTask);
module.exports = router;
