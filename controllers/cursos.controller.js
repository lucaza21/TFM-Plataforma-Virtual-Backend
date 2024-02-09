// const { connection} = require('./../SQL/sql.connection.platvirt');
const db = require('./../models/sql.connection.platvirt');


const CatCursos = db.catcursos

module.exports.getCursos = async (req, res, next) => {
    //console.log(req.body)
    // const conn = 
    let material = await CatCursos.findAll();
    res.status(200).send(material);

};
