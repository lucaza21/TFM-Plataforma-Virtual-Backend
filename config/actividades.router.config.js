const express = require("express");
const router = express.Router();

//import users controller
const actividades = require("../controllers/actividades.controller");



router.get("/listar", actividades.listar_actividad);
router.post("/crear", actividades.crear_actividad);
router.get("/bulk", actividades.bulk_actividad);
/* router.post("/subir", catCursos.subirArchivos);
router.delete("/eliminar/:id", catCursos.eliminar_catCursos); */



router.get("/", (req, res) => {
    res.json({ message: "Hello desde Alumnos" })
})

module.exports = router;