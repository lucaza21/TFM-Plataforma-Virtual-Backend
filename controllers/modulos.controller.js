//import model
const { uploadFolder, uploadImage, deleteImage, deleteAllImages, deleteFolder } = require("../cloudinary");
const fs = require('fs-extra');

const Modulo = require('../models/modulo.model')
const Profesor = require("../models/profesor.model");
const CursoAlumno = require("../models/curso_alumno.model");
const Alumno = require("../models/alumno.model");
const catCursos = require("../models/catcurso.model");
const Actividad = require("../models/actividades.model");


module.exports.listar_modulo = (req, res, next) => {
    //console.log(req.body)
    Modulo.findAll(   
        { 
            //where: {id_curso: 2 },
            include: [
                {
                    model: Actividad,
                    as:'actividades', 
                    attributes: ["id_actividad","nombre_actividad", "ruta_actividad"] 
                },
                {
                model: catCursos,
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
            }], 
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

module.exports.crear_modulo = (req, res, next) => {
    const id_curso = req.params.id
    const body = req.body;
    body.id_curso = id_curso
    //console.log(body)

    //crear nuevo modelo y añadir carpeta de modulo a cloudinary
    catCursos.findOne(
        { 
            where: {id_curso: id_curso},
            attributes:['id_curso','id_profesor', 'titulo', 'ruta_material_didactico', 'insumos'],
            raw: true 
        }).then(curso => {
            console.log("cuso: ",curso)
            found = curso
            if(curso === null){
                throw new Error("El curso mencionado no existe")
            }
            return Modulo.findOne({where:{nombre_modulo: body.nombre_modulo, id_curso:id_curso}})
        }).then(modulo => {
            console.log("found: ",found)
            if(modulo !== null){
                throw new Error("El modulo mencionado Ya existe para ese curso - Dos modulos no pueden llevar el mismo Titulo dentro del mismo curso")
            }
            folder = found.ruta_material_didactico[0].folder
            return uploadFolder(`${folder}/${body.nombre_modulo}`, `${body.nombre_modulo}`)
        }).then((result) => {
            console.log(result)
            body.ruta_material_didactico = [{
                public_id: result.public_id,
                url: result.url,
                folder: result.folder,
                archivos: []
            }]
            return Modulo.create(body)
        }).then(response => {
            console.log(response)
            modulo_creado = response
            if(response === null){
                throw new Error("No se pudo crear el modulo")
            }
            //console.log(response.dataValues)
            return deleteImage(response.ruta_material_didactico[0].public_id)
        }).then(responseDelete => {
            console.log(responseDelete)
            if(responseDelete.result !== "ok"){
                throw new Error("No se pudo crear el modulo en cloudinary")
            }
            return res.status(201).json( {message:' Se ha creado el modulo', modulo: modulo_creado })
        }).catch((error) =>{
            return res.status(400).json({ message: `Error creando modulo: - ${error.name}: ${error.message}`});
        })
     
};

module.exports.subirArchivos = (req, res, next) => {
    const id_modulo = req.params.id
    if (req.file == null) {
        return res.status(400).json({Error: `Error subiendo el archivo - No se seleccionó ningún archivo. `});
    }

    oName = req.file.originalname.split('.')[0]
    Modulo.findOne(
        { 
            where: {id_modulo: id_modulo},
            attributes:['id_modulo','id_curso', 'nombre_modulo', 'ruta_material_didactico'],
            raw: true 
        }).then(modulo => {
            if(modulo === null){
                throw new Error("El modulo mencionado no existe")
            }
            data = modulo.ruta_material_didactico
            ruta = modulo.ruta_material_didactico[0].folder
            return uploadImage(req.file.path, ruta, oName)
        }).then( uploadResponse => {

            if(uploadResponse == null){
                throw new Error("No se pudo subir el archivo")
            }

            const existeUrl = data[0].archivos.some(archivo => archivo.url.includes(uploadResponse.url));
            if(existeUrl){
                throw new Error("Ya hay un archivo con ese nombre, los archivos no pueden tener el mismo nombre")
            }

            newArchivo = [{
                url: data[0]?.url,
                folder: data[0]?.folder,
                public_id: data[0]?.public_id,
                archivos: [...data[0]?.archivos, {fName:oName, url:uploadResponse.url}]
            }]

            fs.unlink(req.file.path)
            return Modulo.update({ ruta_material_didactico : newArchivo},{
                where: {id_modulo: id},
                })
        }).then(updated => {
            if(updated == 0){
                return res.status(400).json({message: "Registro no fue actualizado."});
            }else{
                return res.status(200).json({message: `Se ha subido el archivo ${req.file.originalname} a la carpeta ${ruta}`});
            }
        }).catch(error => {
            fs.unlink(req.file.path)
            return res.status(400).json({Error: `Error subiendo el archivo - ${error.name}: ${error.message}`});
        })
    };

module.exports.editar_modulo = (req, res )=>{

    const id_modulo = req.params.id;
    body = req.body
    //console.log(body)
    //archivos = body.ruta_material_didactico[0].archivos

    Modulo.findOne(
        { 
            where: {id_modulo: id_modulo}
        }).then(modulo => {
            if(modulo === null){
                throw new Error("El modulo mencionado no existe")
            }
            return Modulo.update( body,
                { 
                    where: {id_modulo: id_modulo}
                })
        }).then(updated =>{
            if(updated == 0){
                return res.status(400).json({message: "Registro no fue actualizado."});
            }else{
                return res.status(200).json({message: `Se han editado los datos del modulo ${body.nombre_modulo}`});
            }
    }).catch( error =>{
        return res.status(500).json({message: `Error editando el modulo - ${error.name}: ${error.message}`});
    });
};

module.exports.eliminar_modulo = async (req, res, next) => {
    const id_modulo = req.params.id
    Modulo.findOne(
        { 
            where: {id_modulo: id_modulo},
            attributes:['id_modulo','id_curso', 'nombre_modulo', 'ruta_material_didactico'],
            raw: true 
        }).then(modulo => {
            if(modulo === null){
                throw new Error("El modulo mencionado no existe")
            }
            //console.log(curso)
            //folder = JSON.parse(curso.ruta_material_didactico)[0].folder
            //public_id = JSON.parse(curso.ruta_material_didactico)[0].public_id
            //public_id = curso.ruta_material_didactico[0].public_id
            folder = modulo.ruta_material_didactico[0].folder
    
            return deleteAllImages(folder)
        }).then(response => {
            return deleteFolder(folder)
        }).then(response => {
            Modulo.destroy({
                where: {
                        id_modulo: id_modulo
                        }
                })
        })
        .then(response => {
            return res.status(200).json({message: `Se han eliminado todas los archivos del folder, el folder y el modulo ${folder} de la DDBB`});
        })
        .catch(error => {
            return res.status(400).json({Error: `Error eliminando modulo - ${error.name}: ${error.message}`});
        })     

};



