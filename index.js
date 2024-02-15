const express = require("express");
const app = express();


//import SQL-db-config
//require("./SQL/sql.connection.sakila");

app.use((req,res,next) => {
    console.log("request received: ", req.method, req.path)
    next();
})

//allow body data
app.use(express.json());

//import sakila router
//const sakila_router = require("./config/sakila.router.config");
//app.use(sakila_router);

require("./models/asociations")

//import alumnos router
const alumnos_router = require("./config/alumnos.router.config");
app.use('/api/alumnos', alumnos_router);

//import profesors router
const profesors_router = require("./config/profesors.router.config");
app.use('/api/profesors', profesors_router);

//import catCursos router
const catCursos_router = require("./config/catcursos.router.config");
app.use('/api/catcursos', catCursos_router);

app.use((error, req,res,next) => {
    console.error("Error: ", error)
    next();
})

//listen port
app.listen(8000, () =>{
    console.log("app running on http://localhost:8000");
})