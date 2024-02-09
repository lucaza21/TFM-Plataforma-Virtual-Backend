// import {methods as platfcontroller} from './../controllers/cursos.controller';

const express = require("express");
const router = express.Router();

const cursos = require("../controllers/cursos.controller");

router.get("/getAll", cursos.getCursos);

module.exports = router;