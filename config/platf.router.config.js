// import {methods as platfcontroller} from './../controllers/cursos.controller';

const express = require("express");
const router = express.Router();


//import users controller
const personas = require("../controllers/platf.controller");
const middleware = require("../middlewares/secure.middleware");
const cursos = require("../controllers/cursos.controller");

router.get("/api/personas", personas.listar_personas);
router.post("/api/crear_persona", personas.crear_persona);
router.delete("/api/elim_persona/:id", personas.eliminar_persona);


/* router.post("/api/users", users.create);
router.get("/api/users/confirm/:email", users.confirm);
router.post("/api/users/login", users.login);
router.get("/api/users/:id", users.detail);
router.patch("/api/users/:id", middleware.checkAuth, users.update);
router.delete("/api/users/:id", middleware.checkAuth, users.delete);

router.get("/api/filter", users.filter); */

router.get("/", (req, res) => {
    res.json({ message: "Hello World" })
})


// router.get("/getCursos", cursos.getCursos);


module.exports = router;