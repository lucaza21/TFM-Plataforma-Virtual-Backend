const express = require("express");
const router = express.Router();

//import users controller
const alumnos = require("../controllers/alumnos.controller");
const middleware = require("../middlewares/secure.middleware")

router.post("/login", alumnos.login_alumnos);
router.post("/crear", alumnos.crear_alumno);

router.get("/listar", alumnos.listar_alumnos);
router.get("/bulk", alumnos.bulk);
router.delete("/eliminar/:id", alumnos.eliminar_alumno);


/*
router.get("/api/users/:id", users.detail);
router.patch("/api/users/:id", middleware.checkAuth, users.update);
router.get("/api/filter", users.filter); */

router.get("/", (req, res) => {
    res.json({ message: "Hello desde Alumnos" })
})

module.exports = router;