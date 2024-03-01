//import model
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const CatCursos = require("../models/catcurso.model");
const Profesor = require("../models/profesor.model");
const CursoAlumno = require("../models/curso_alumno.model");
const Alumno = require("../models/alumno.model");
const Modulo = require("../models/modulo.model");
const Calificacion = require("../models/calificaciones.model");
const Entrega = require("../models/entregas.model");
const Actividad = require("../models/actividades.model");




module.exports.listar_calificacion = (req, res, next) => {
    //console.log(req.body)
    Calificacion.findAll(   
        { 
            //where: {id_curso: 2 },
            include: {
                model: Entrega,
                as:'entrega_actividades',
                required:true,
                include:[
                    {
                        model:Alumno,
                        as:'alumno'
                    },
                    {
                        model:Actividad,
                        as: 'actividades'
                    }
                ]   
            }, 
            //attributes:['id_Calificacion','id_curso','nombre_Calificacion',], 
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
            return res.status(400).json({message: `Error listando calificacion : ${error.message}`});
        });
     
};

module.exports.crear_calificacion = (req, res, next) => {
    //console.log(req.body)
    const body = req.body;
    console.log(body)

    //crear nuevo curso
    Calificacion.create(body)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando calificacion: ${error.message}`});
    })
     
};

module.exports.bulk_calificacion = (req, res, next) => {
    let bulk = [
        {
            "id_entrega": 1,
            "calificacion": 9.5,
            "comentario_calificacion": "muy bien",
        },
        {
            "id_entrega": 2,
            "calificacion": 9.5,
            "comentario_calificacion": "muy bien",
        },
        {
            "id_entrega": 3,
            "calificacion": 9.5,
            "comentario_calificacion": "muy bien",
        },
        
        ]
    //crear nueva curso
    Calificacion.bulkCreate(bulk)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando calificaciones: ${error}`});
    })
    
};

/* module.exports.eliminar_catCursos = async (req, res, next) => {
    const id = req.params.id

    await catCursos.findOne(
        { 
            where: {id_curso: id}
        }
        ).then(response => {
            //console.log(response.ruta_material_didactico.includes("public_id"))
            if(response.ruta_material_didactico.includes("public_id"))
                {
                    deleteImage(JSON.parse(response.ruta_material_didactico)[0].public_id)
                    console.log('imagen de cloudinary eliminada')
                }
            catCursos.destroy({
                where: {
                        id_curso: response.id_curso
                        }
                }).then(rowDeleted => {
                    if(rowDeleted === 0){
                        return res.status(404).json({message: "curso no existe"});
                    } else {
                        console.log("curso eliminado")
                        //console.log(rowDeleted)
                        return res.status(204).json();
                    }
                }) // rowDeleted will return number of rows deleted
                .catch((error) =>{
                    return res.status(400).json({ message: `Error eliminando curso: ${error.message}`});
                })
            
        })
        .catch((error) => {
            return res.status(400).json({message: `Error listando cursos : ${error.message}`});
        });
             
   
};   */
    
