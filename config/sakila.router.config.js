const express = require("express");
const router = express.Router();

//import users controller
const countries = require("../controllers/sakila.controller");
const middleware = require("../middlewares/secure.middleware")

router.get("/api/country", countries.list_country);
router.get("/api/actor", countries.list_actor);

/* router.post("/api/users", users.create);
router.get("/api/users/confirm/:email", users.confirm);
router.post("/api/users/login", users.login);
router.get("/api/users/:id", users.detail);
router.patch("/api/users/:id", middleware.checkAuth, users.update);
router.delete("/api/users/:id", middleware.checkAuth, users.delete);

router.get("/api/filter", users.filter); */

router.get("/", (req, res) => {
    res.json({ message: "Hello World" })
})

module.exports = router;