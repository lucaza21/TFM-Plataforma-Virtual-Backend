const express = require("express");
const router = express.Router();

//import users controller
const actividades = require("../controllers/actividades.controller");

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get("/listar", actividades.listar_actividad);
router.post("/crear/:id", actividades.crear_actividad);
router.get("/detalle/:id", actividades.detalle_actividad);
router.get("/bulk", actividades.bulk_actividad);
router.post("/subir/:id", upload.single('file'), actividades.subirArchivos);
router.put("/editar/:id", actividades.editar_actividad);
router.delete("/eliminar/:id", actividades.eliminar_actividad);
/* router.post("/subir", catCursos.subirArchivos);
router.delete("/eliminar/:id", catCursos.eliminar_catCursos); */



router.get("/", (req, res) => {
    res.json({ message: "Hello desde Alumnos" })
})

module.exports = router;