const express = require("express");
const router = express.Router();

const profesor = require("../controllers/profesor.controller");

router.get("/getAll", profesor.getProfesors);

module.exports = router;