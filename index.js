const platf_router = require("./config/platf.router.config");
const cursos_router = require("./config/cursos.router.config");

const express = require("express");
const app = express();



//import SQL-db-config
const {sequelize, connection} = require('./models/sql.connection.platvirt');

app.use((req,res,next) => {
    console.log("request received: ", req.method, req.path)
    next();
})

//allow body data
app.use(express.json());

//import sakila router
// const sakila_router = require("./config/sakila.router.config");
// app.use(sakila_router);

//import plataforma_virtual router

const { connect } = require("mongoose");

// Rutas
app.use(platf_router);

app.use("/api/cursos", cursos_router);

app.use((error, req,res,next) => {
    console.error("Error: ", error)
    next();
})




//listen port
app.listen(8000, async () =>{
    console.log("app running on http://localhost:8000");
    // await connection();
})