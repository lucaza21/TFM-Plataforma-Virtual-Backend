const express = require("express");
const app = express();


//import SQL-db-config
require("./SQL/sql.connection.sakila");

app.use((req,res,next) => {
    console.log("request received: ", req.method, req.path)
    next();
})

//allow body data
app.use(express.json());

//import sakila router
const sakila_router = require("./config/sakila.router.config");
app.use(sakila_router);

//import plataforma_virtual router
const platf_router = require("./config/platf.router.config");
app.use(platf_router);

app.use((error, req,res,next) => {
    console.error("Error: ", error)
    next();
})

//listen port
app.listen(8000, () =>{
    console.log("app running on http://localhost:8000");
})