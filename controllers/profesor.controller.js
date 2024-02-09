// const { connection} = require('./../SQL/sql.connection.platvirt');
const db = require('./../models/sql.connection.platvirt');


const Profesor = db.profesor

module.exports.getProfesors = async (req, res, next) => {
    //console.log(req.body)
    // const conn = 
    let profesor = await Profesor.findAll();
    res.status(200).send(profesor);

};
