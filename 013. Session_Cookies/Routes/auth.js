const express = require("express")
const route = express.Router()
const getAuth = require("../controllers/auth")

route.get("/login", getAuth)

module.exports = route