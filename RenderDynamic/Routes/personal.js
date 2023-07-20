const express = require("express");
const route = express.Router();
const path = require("path");
const rootDir = require("../util/path.js");

/* {Sharing Data} */
const adminRoute = require("./admin.js");

route.get("/", (req, res) => {
  /* {Sharing Data} */
  console.log('product:',adminRoute.products);
  res.sendFile(path.join(rootDir, "views", "home.html"));
});
module.exports = route;
