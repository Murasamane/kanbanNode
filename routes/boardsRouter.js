const express = require("express");
const boardControllers = require("../controllers/boardControllers");

const { getAllBoards, getBoard, createBoard, createNewColumn, createNewTask } =
  boardControllers;
const router = express.Router();

router.route("/").get(getAllBoards).post(createBoard);
router.route("/:id").get(getBoard).post(createNewColumn);
router.route("/:id/:columnName").post(createNewTask);
module.exports = router;
