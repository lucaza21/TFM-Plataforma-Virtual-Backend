const express = require("express");
const router = express.Router();

//import users controller
const calificaciones = require("../controllers/calificaciones.controller");



router.get("/listar", calificaciones.listar_calificacion);
router.post("/crear", calificaciones.crear_calificacion);
router.get("/bulk", calificaciones.bulk_calificacion);
/* router.post("/subir", catCursos.subirArchivos);
router.delete("/eliminar/:id", catCursos.eliminar_catCursos); */



router.get("/", (req, res) => {
    res.json({ message: "Hello desde Alumnos" })
})

module.exports = router;