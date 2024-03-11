//import model
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Modulo = require('../models/modulo.model')
const CatCursos = require("../models/catcurso.model");
const Profesor = require("../models/profesor.model");
const CursoAlumno = require("../models/curso_alumno.model");
const Alumno = require("../models/alumno.model");



module.exports.listar_modulo = (req, res, next) => {
    //console.log(req.body)
    Modulo.findAll(   
        { 
            //where: {id_curso: 2 },
            include: {
                model: CatCursos,
                as:'cat_cursos',
                required:true,
                include:[
                    {
                        model:CursoAlumno,
                        as:'curso_alumno'
                    },
                    {
                        model:Alumno,
                        as: 'alumno'
                    }
                ]   
            }, 
            //attributes:['id_modulo','id_curso','nombre_modulo',], 
            //raw:true
        }
        ).then(response => {
            //acceder valores dentro de la asociacion
            //console.log(response[3].dataValues.cat_cursos.dataValues.titulo)
            return res.status(200).json(response)
            //res.send("listando cursos desde SQL")
        })
        .catch((error) => {
            return res.status(400).json({message: `Error listando modulo : ${error.message}`});
        });
     
};

module.exports.crear_modulo = (req, res, next) => {
    const id_curso = req.params.id
    const body = req.body;
    body.id_curso = id_curso
    console.log(body)

    //crear nuevo curso
    Modulo.create(body)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando modulo: ${error.message}`});
    })
     
};

module.exports.bulk_modulo = (req, res, next) => {
    let bulk = [
        {
            "id_curso": 3,
            "nombre_modulo": "introducción CSS",
            "objetivo_particular": "entender principios",
            "horas": 45,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_material_didactico": "a/una/ruta"
        },
        {
            "id_curso": 3,
            "nombre_modulo": "introducción JS",
            "objetivo_particular": "entender principios",
            "horas": 45,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_material_didactico": "a/una/ruta"
        },
        {
            "id_curso": 1,
            "nombre_modulo": "introducción HTML",
            "objetivo_particular": "entender principios",
            "horas": 45,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_material_didactico": "a/una/ruta"
        },
        {
            "id_curso": 1,
            "nombre_modulo": "HTML BASICO",
            "objetivo_particular": "entender principios",
            "horas": 45,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_material_didactico": "a/una/ruta"
        },
        ]
    //crear nueva curso
    Modulo.bulkCreate(bulk)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando cursos: ${error}`});
    })
    
};

/* module.exports.bulk_catCursos = (req, res, next) => {

    let cursos = [
            {
                id_profesor: 1,
                titulo: "INTRO HTML",
                nombre_disenador: "disenado1",
                objetivo: "aprender bases html",
                introduccion: "aprender bases html",
                metodologia: "virtual",
                ruta_material_didactico: "a/una/ruta",
                perfil_ingreso: "xxx",
                insumos: "xxx",
                evaluacion: "si",
                horas: 4,
                semanas: 2,
            },
             {
                id_profesor: 2,
                titulo: "INTRO JS",
                nombre_disenador: "disenado2",
                objetivo: "aprender bases JS",
                introduccion: "aprender bases JS",
                metodologia: "virtual",
                ruta_material_didactico: "a/una/ruta",
                perfil_ingreso: "xxx",
                insumos: "xxx",
                evaluacion: "si",
                horas: 4,
                semanas: 2,
            },
            {
                id_profesor: 1,
                titulo: "INTRO CSS",
                nombre_disenador: "disenado1",
                objetivo: "aprender bases CSS",
                introduccion: "aprender bases CSS",
                metodologia: "virtual",
                ruta_material_didactico: "a/una/ruta",
                perfil_ingreso: "xxx",
                insumos: "xxx",
                evaluacion: "si",
                horas: 4,
                semanas: 2,
            }, 
        ]
    //crear nueva curso
    catCursos.bulkCreate(cursos)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando cursos: ${error}`});
    })
    
}; 

module.exports.crear_catCursos = (req, res, next) => {
  
    const body = req.body;
    console.log(body)

    //crear nuevo curso
    catCursos.create(body)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando curso: ${error.message}`});
    })
};

module.exports.subirArchivos = async (req, res, next) => {

    console.log(req.files?.image)
    if (req.files?.image){
        const result = await uploadImage(req.files.image.tempFilePath)
        console.log(result)
        const body = req.body;
        //console.log(body)
        body.ruta_material_didactico = [{
            public_id: result.public_id,
            url: result.url
        }]
        
        await fs.unlink(req.files.image.tempFilePath)

        //crear nuevo curso
        catCursos.create(body)
        .then((curso) => {
            return res.status(201).json( { curso:curso } )
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error creando curso: ${error.message}`});
        })
    }
    
};

module.exports.eliminar_catCursos = async (req, res, next) => {
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
    
