const express = require("express");
const route = express.Router();
const getAuth = require("../controllers/auth");

route.get("/login", getAuth.getAuth);
route.post("/login", getAuth.postAuth);

module.exports = route;
