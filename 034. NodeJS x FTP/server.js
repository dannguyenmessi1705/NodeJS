const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const ftp = require("ftp");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const diskStorage = require("./utils/multerConfig");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStrore = require("connect-mongodb-session")(session);
const URL = require("./utils/database");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const storedb = new MongoDBStrore({
  uri: URL,
  collection: "sessions",
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storedb,
    cookie: {
      maxAge: 1000 * 60 * 60 * 1,
    },
  })
);

app.use(multer({ storage: diskStorage }).single("file"));

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
app.use("/auth", authRouter);
app.use("/user", userRouter);

mongoose
  .connect(URL)
  .then(() => {
    app.listen(process.env.SERVER_PORT, process.env.IP, () => {
      console.log("Server is running at port " + process.env.SERVER_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
