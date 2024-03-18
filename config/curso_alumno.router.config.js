const express = require("express");
const router = express.Router();

//import users controller
const cursoAlumno = require("../controllers/curso_alumno.controller");



router.get("/listar", cursoAlumno.listar_curso_alumno);
router.post("/crear/:id_curso/:id_alumno", cursoAlumno.crear_curso_alumno);
router.get("/bulk", cursoAlumno.bulk_curso_alumno);
/*router.post("/subir", catCursos.subirArchivos);*/
router.put("/editar/:id_curso/:id_alumno", cursoAlumno.editar_curso_alumno)
router.delete("/eliminar/:id_curso/:id_alumno", cursoAlumno.eliminar_curso_alumno); 



router.get("/", (req, res) => {
    res.json({ message: "Hello desde Alumnos" })
})

module.exports = router;