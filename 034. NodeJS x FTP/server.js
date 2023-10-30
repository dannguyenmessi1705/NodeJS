const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const ftp = require("ftp");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const diskStorage = require("./utils/multerConfig");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: diskStorage }).single("file"));

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.listen(3000, "localhost", () => {
  console.log("Server is running on port 3000");
});
