const express = require("express");
const boardControllers = require("../controllers/boardControllers");

const { getAllBoards } = boardControllers;
const router = express.Router();

router.route("/").get(getAllBoards);

module.exports = router;
