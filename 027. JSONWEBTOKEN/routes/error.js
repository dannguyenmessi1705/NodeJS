const express = require("express");
const route = express.Router();
const error = require("../controllers/error");
const {CreateCSRFTOKEN, verifyCSRFToken} = require("../middleware/csrfToken")


route.get("/500-maintenance", CreateCSRFTOKEN, error.serverError)
route.get("/*", CreateCSRFTOKEN, error.notFound);

module.exports = route;
