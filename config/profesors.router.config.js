const express = require("express");
const router = express.Router();

//import users controller
const profesors = require("../controllers/profesors.controller");
const middleware = require("../middlewares/secure.middleware")

router.post("/login", profesors.login_profesor);
router.post("/crear", profesors.crear_profesor);

router.get("/listar", profesors.listar_profesor);
router.get("/bulk", profesors.bulk);
router.delete("/eliminar/:id", profesors.eliminar_profesor);


/* 
router.get("/api/users/:id", users.detail);
router.patch("/api/users/:id", middleware.checkAuth, users.update);
router.get("/api/filter", users.filter); */

router.get("/", (req, res) => {
    res.json({ message: "Hello desde Profesors" })
})

module.exports = router;