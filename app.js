const express = require("express");
require("dotenv").config({ path: "./config/config.env" });
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({}));

//importing routes

app.get("/" ,(req, res) => {
    res.status(200).send("hello world")
})
const postRouter = require("./routes/post.js");
const userRouter = require("./routes/user.js");

app.use("/api/v1", postRouter);
app.use("/api/v1", userRouter);

module.exports = app;
