const express = require("express");
const router = express.Router();

//import users controller
const catCursos = require("../controllers/catcursos.controller");
const middleware = require("../middlewares/secure.middleware")


router.get("/listar", catCursos.listar_catCursos);
router.get("/bulk", catCursos.bulk);
router.post("/crear", catCursos.crear_catCursos);
router.post("/subir", catCursos.subirArchivos);
router.delete("/eliminar/:id", catCursos.eliminar_catCursos);

/* router.post("/login", alumnos.login_alumnos);
router.post("/crear", alumnos.crear_alumno);

router.delete("/eliminar/:id", alumnos.eliminar_alumno); */


/*
router.get("/api/users/:id", users.detail);
router.patch("/api/users/:id", middleware.checkAuth, users.update);
router.get("/api/filter", users.filter); */

router.get("/", (req, res) => {
    res.json({ message: "Hello desde Alumnos" })
})

module.exports = router;