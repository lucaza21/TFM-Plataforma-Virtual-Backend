//import model
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Actividad = require('../models/actividades.model')
const CatCursos = require("../models/catcurso.model");
const Profesor = require("../models/profesor.model");
const CursoAlumno = require("../models/curso_alumno.model");
const Alumno = require("../models/alumno.model");
const Modulo = require("../models/modulo.model");
const Entrega = require("../models/entregas.model");



module.exports.listar_entrega = (req, res, next) => {
    //console.log(req.body)
    Entrega.findAll(   
        { 
            //where: {id_curso: 2 },
            include: [{
                model: Actividad,
                as:'actividades',
                required:true,
                /*include:[
                    {
                        model:Alumno,
                        as:'alumno'
                    },
                     {
                        model:Alumno,
                        as: 'alumno'
                    } 
                ]*/
            }, 
            {
                model:Alumno,
                as:'alumno'
            }
        ]
            //attributes:['id_Actividad','id_curso','nombre_Actividad',], 
            //raw:true
        }
        ).then(response => {
            //acceder valores dentro de la asociacion
            //console.log(response[3].dataValues.cat_cursos.dataValues.titulo)
            console.log(response)
            return res.status(200).json(response)
            //res.send("listando cursos desde SQL")
        })
        .catch((error) => {
            return res.status(400).json({message: `Error listando Entrega : ${error.message}`});
        });
     
};

module.exports.crear_entrega = (req, res, next) => {
    //console.log(req.body)
    const body = req.body;
    console.log(body)

    //crear nuevo curso
    Entrega.create(body)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando Entrega: ${error.message}`});
    })
     
};

module.exports.bulk_entrega = (req, res, next) => {
    let bulk = [
        {
            "id_actividad": 1,
            "id_alumno": 1,
            "fecha_entrega": "2024-10-31 01:34:48.81+00",
            "ruta_entrega": "a/una/ruta",
            "comentario_entrega": "Comentario_Acividad_1",
        },
        {
            "id_actividad": 2,
            "id_alumno": 2,
            "fecha_entrega": "2024-10-31 01:34:48.81+00",
            "ruta_entrega": "a/una/ruta",
            "comentario_entrega": "Comentario_Acividad_2",
        },
        {
            "id_actividad": 3,
            "id_alumno": 3,
            "fecha_entrega": "2024-10-31 01:34:48.81+00",
            "ruta_entrega": "a/una/ruta",
            "comentario_entrega": "Comentario_Acividad_1",
        },
        
        ]
    //crear nueva curso
    Entrega.bulkCreate(bulk)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando Entrega: ${error}`});
    })
    
};

