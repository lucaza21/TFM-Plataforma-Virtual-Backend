const express = require("express");
const router = express.Router();

//import users controller
const entregas = require("../controllers/entregas.controller");



router.get("/listar", entregas.listar_entrega);
router.post("/crear", entregas.crear_entrega);
router.get("/bulk", entregas.bulk_entrega);
/* router.post("/subir", catCursos.subirArchivos);*/
router.put("/editar/:id", entregas.editar_entrega);
router.delete("/eliminar/:id", entregas.eliminar_entrega); 



router.get("/", (req, res) => {
    res.json({ message: "Hello desde Alumnos" })
})

module.exports = router;