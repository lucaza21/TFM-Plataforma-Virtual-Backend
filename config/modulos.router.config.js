const express = require("express");
const router = express.Router();

//import users controller
const modulos = require("../controllers/modulos.controller");

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get("/listar", modulos.listar_modulo);
router.post("/crear/:id", modulos.crear_modulo);
router.get("/bulk", modulos.bulk_modulo);
router.post("/subir/:id", upload.single('file'), modulos.subirArchivos);
router.put("/editar/:id", modulos.editar_modulo);
router.delete("/eliminar/:id", modulos.eliminar_modulo);




router.get("/", (req, res) => {
    res.json({ message: "Hello desde Alumnos" })
})

module.exports = router;