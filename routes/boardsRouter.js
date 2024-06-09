const express = require("express");
const boardControllers = require("../controllers/boardControllers");

const {
  getAllBoards,
  getBoard,
  createBoard,
  deleteBoard,
  updateBoard,
  getBoardsInfo,
  getColumnsList,
} = boardControllers;
const router = express.Router();

router.route("/").get(getAllBoards).post(createBoard);
router.route("/boardLinks").get(getBoardsInfo);
router.route("/:id").get(getBoard).patch(updateBoard).delete(deleteBoard);
router.route("/:id/columnInfo").get(getColumnsList);

module.exports = router;
