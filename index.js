const express = require("express");
const app = express();
const cors = require('cors')
const fileUpload = require('express-fileupload')


//import SQL-db-config
//require("./SQL/sql.connection.sakila");

//import sakila router
//const sakila_router = require("./config/sakila.router.config");
//app.use(sakila_router);

app.use((req,res,next) => {
    console.log("request received: ", req.method, req.path)
    next();
})

//allo CORS
app.use(cors())
//allow body data
app.use(express.json());
//allow upload Files
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));

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

//import cursoALumno router
const cursoAlumno_router = require("./config/curso_alumno.router.config");
app.use('/api/cursoalumno', cursoAlumno_router);

//import modulos router
const modulos_router = require("./config/modulos.router.config");
app.use('/api/modulos', modulos_router);

//import actividades router
const actividades_router = require("./config/actividades.router.config");
app.use('/api/actividades', actividades_router);

//import entregas router
const entregas_router = require("./config/entregas.router.config");
app.use('/api/entregas', entregas_router);

app.use((error, req,res,next) => {
    console.error("Error: ", error)
    next();
})

//listen port
app.listen(8000, () =>{
    console.log("app running on http://localhost:8000");
})