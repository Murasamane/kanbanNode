const express = require("express");
const boardControllers = require("../controllers/boardControllers");

const { getAllBoards, getBoard, createBoard } = boardControllers;
const router = express.Router();

router.route("/").get(getAllBoards).post(createBoard);
router.route("/:id").get(getBoard);
module.exports = router;
