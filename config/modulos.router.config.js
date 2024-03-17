const express = require("express");
const router = express.Router();

//import users controller
const modulos = require("../controllers/modulos.controller");



router.get("/listar", modulos.listar_modulo);
router.post("/crear", modulos.crear_modulo);
router.get("/bulk", modulos.bulk_modulo);
/* router.post("/subir", catCursos.subirArchivos);*/
router.put("/editar/:id", modulos.editar_modulo);
router.delete("/eliminar/:id", modulos.eliminar_modulo); 

router.get("/", (req, res) => {
    res.json({ message: "Hello desde Alumnos" })
})

module.exports = router;