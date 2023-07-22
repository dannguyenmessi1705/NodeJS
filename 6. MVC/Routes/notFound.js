const express = require("express");
const route = express.Router();
const notFound = require("../controllers/404"); // import controller

route.get("/*", notFound); // điều hướng đến controller xư lý và trả về 404.ejs

module.exports = route;
