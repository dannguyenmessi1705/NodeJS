const express = require("express");
const route = express.Router();

const path = require("path");

const rootDir = require("../util/path.js");

route.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

module.exports = route;
