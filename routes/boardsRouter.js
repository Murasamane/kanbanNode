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
  createSubTask,
  updateBoard,
  updateColumn,
  updateTask,
  getBoardsInfo,
} = boardControllers;
const router = express.Router();

router.route("/").get(getAllBoards).post(createBoard);
router.route("/boardLinks").get(getBoardsInfo);
router
  .route("/:id")
  .get(getBoard)
  .post(createNewColumn)
  .patch(updateBoard)
  .delete(deleteBoard);
router
  .route("/:id/:columnId")
  .post(createNewTask)
  .patch(updateColumn)
  .delete(deleteColumn);
router
  .route("/:id/:columnId/:taskId")
  .post(createSubTask)
  .patch(updateTask)
  .delete(deleteTask);
module.exports = router;
