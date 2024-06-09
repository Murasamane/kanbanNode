const express = require("express");
const cors = require("cors");
const boardsRouter = require("./routes/boardsRouter");
const taskRouter = require("./routes/taskRouter");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/boards", boardsRouter);
app.use("/api/v1/tasks", taskRouter);
module.exports = app;
