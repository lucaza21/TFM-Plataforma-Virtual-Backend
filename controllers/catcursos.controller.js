//import model
const { uploadFolder, uploadImage, deleteFolder, deleteAllImages, deleteImage} = require("../cloudinary");
const fs = require('fs-extra');

const Profesor = require("../models/profesor.model");
const Alumno = require("../models/alumno.model");
const catCursos = require("../models/catcurso.model");
const CursoAlumno = require("../models/curso_alumno.model");
const Modulo = require("../models/modulo.model");
const Actividad = require("../models/actividades.model");


module.exports.listar_catCursos = (req, res, next) => {
    //console.log(req.body)
    catCursos.findAll(
        { 
            include:
                [
                    {
                        model: Profesor,
                        as: 'profesor',
                        attributes: ["nombre", "ap_paterno"]    
                    },
                    {
                        model: Alumno,
                        as: 'alumno',
                        attributes: ["nombre", "ap_paterno"]    
                    },
                    {
                        model: Modulo,
                        as: 'modulos',
                        attributes: ["id_modulo","nombre_modulo", "ruta_material_didactico"],
                        include:[
                            {
                            model: Actividad,
                            as:'actividades', 
                            attributes: ["id_actividad","nombre_actividad", "ruta_actividad"]
                            }
                        ]       
                    },
                ], 
            }
        ).then(response => {
            //console.log(response)
            return res.status(200).json(response)
            //res.send("listando cursos desde SQL")
        })
        .catch((error) => {
            return res.status(400).json({message: `Error listando cursos : ${error.message}`});
        });
     
};

module.exports.detalle_catCursos = (req, res, next) => {
    //console.log(req.body)
    const id_curso = req.params.id
    catCursos.findOne(
        { 
            where: {id_curso: id_curso},
            //raw: true,
            include:
                [
                    {
                        model: Profesor,
                        as: 'profesor',
                        attributes: ["nombre", "ap_paterno"]    
                    },
                    {
                        model: Alumno,
                        as: 'alumno',
                        attributes: ["nombre", "ap_paterno"]    
                    },
                    {
                        model: Modulo,
                        as: 'modulos',
                        attributes: ["id_modulo","nombre_modulo", "ruta_material_didactico"],
                        include:[
                            {
                            model: Actividad,
                            as:'actividades', 
                            attributes: ["id_actividad","nombre_actividad", "ruta_actividad"]
                            }
                        ]       
                    },
                ], 
            }
        ).then(curso => {
            if(curso === null){
                throw new Error("El curso mencionado no existe")
            }
            
            return res.status(200).json(curso)
        }).catch((error) => {
            return res.status(400).json({message: `Error listando cursos - ${error.name}: ${error.message}`});
        });
     
};

module.exports.bulk_catCursos = (req, res, next) => {
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
                id_profesor: 3,
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

module.exports.crear_catCursos = async (req, res, next) => {
    const id_profesor = req.params.id
    const body = req.body;
    body.id_profesor = id_profesor
    catCursos.findOne(
        { 
            where: {titulo: body.titulo},
            raw: true 
        }).then(curso => {
            if(curso !== null){
                throw new Error("El curso mencionado Ya existe - Dos cursos no pueden llevar el mismo Titulo")
            }
            return uploadFolder(body.titulo, "un_nombre")
        }).then((result) => {
            body.ruta_material_didactico = [{
                public_id: result.public_id,
                url: result.url,
                folder: `${body.titulo}/`
            }]
            return catCursos.create(body)
        }).then(response => {
            curso_creado = response
            if(response === null){
                throw new Error("No se pudo crear el curso")
            }
            return deleteImage(response.ruta_material_didactico[0].public_id)
        }).then(responseDelete => {
            //console.log(responseDelete)
            if(responseDelete.result !== "ok"){
                throw new Error("No se pudo crear el curso en cloudinary")
            }
            return res.status(201).json( {message:'Se ha creado el curso', curso: curso_creado } )
        }).catch((error) =>{
            return res.status(400).json({ message: `Error creando curso: - ${error.name}: ${error.message}`});
        })
};

module.exports.subirArchivos = async (req, res, next) => {
    const id_curso = req.params.id
    //console.log(req?.file)
    if (req.file == null) {
        return res.status(400).json({Error: `Error subiendo el archivo - No se seleccionó ningún archivo. `});
    }

    oName = req.file?.originalname.split('.')[0]
    catCursos.findOne(
        { 
            where: {id_curso: id_curso},
            attributes:['id_curso','id_profesor', 'titulo', 'ruta_material_didactico', 'insumos'],
            raw: true 
        }).then(curso => {
            //console.log(curso)
            if(curso === null){
                throw new Error("El curso mencionado no existe")
            }
            //ruta = JSON.parse(curso.ruta_material_didactico)[0].folder
            ruta = curso.ruta_material_didactico[0].folder
            //console.log(ruta)
            return uploadImage(req.file.path, ruta, oName)
        }).then(response => {
            //console.log(response)
            if(response == null){
                throw new Error("No se pudo subir el archivo")
            }
            fs.unlink(req.file.path)
            return response
        }).then(response =>{
            return catCursos.update({ insumos: response.url},{
                where: {id_curso: id_curso},
                })
        }).then(updated => {
            //console.log(updated)
            if(updated == 0){
                return res.status(400).json({message: "Error Registro no fue actualizado."});
            }else{
                return res.status(200).json({message: `Se ha subido el archivo ${req.file.originalname} a la carpeta ${ruta}`});
            }
        }).catch(error => {
            fs.unlink(req.file.path)
            return res.status(400).json({Error: `Error subiendo el archivo - ${error.name}: ${error.message}`});
        })

};

module.exports.editar_catcurso = (req, res )=>{

    const id_curso = req.params.id;
    const body = req.body

    catCursos.findOne(
        { 
            where: {id_curso: id_curso}
        }).then(curso => {
            if(curso === null){
                throw new Error("El curso mencionado no existe")
            }
            return catCursos.update( body,
                { 
                    where: {id_curso: id_curso}
                })
        }).then(updated => {
            if(updated == 0){
                return res.status(400).json({message: "El curso no fue actualizado."});
            }else{
                return res.status(200).json({message: `Se han editado los datos del curso ${body.titulo}`});
            }
        }).catch(error => {
            return res.status(400).json({Error: `Error editando el curso - ${error.name}: ${error.message}`});
        }) 
    /* catCursos.update(req.body, {
        where: {
            id_curso: id
        },
    }).then(updated =>{
        if(updated == 0){
            return res.status(400).json({message: "Registro no fue actualizado."});
        }else{
            return res.status(200).json({message: "El curso fue actualizado correctamente.", updated});
        }
    }).catch( error =>{
        return res.status(500).json({message: "Error actualizando Curso: " + error.message});
    }); */
};

module.exports.eliminar_catCursos = async (req, res, next) => {
    const id_curso = req.params.id
    catCursos.findOne(
        { 
            where: {id_curso: id_curso},
            attributes:['id_curso','id_profesor', 'titulo', 'ruta_material_didactico'],
            include:
                [
                    {
                        model: Modulo,
                        as: 'modulos',
                        attributes: ["id_modulo","nombre_modulo", "ruta_material_didactico"]    
                    },
                ], 
        }).then(curso => {
            if(curso === null){
                throw new Error("El curso mencionado no existe")
            }
            //console.log(curso)
            //folder = JSON.parse(curso.ruta_material_didactico)[0].folder
            //public_id = JSON.parse(curso.ruta_material_didactico)[0].public_id
            folder = curso.ruta_material_didactico[0].folder
            public_id = curso.ruta_material_didactico[0].public_id

            id_modulos = curso.modulos.map(id => id.id_modulo)
            console.log(id_modulos)
            
            return deleteAllImages(folder)
        }).then(response => {
            //console.log(response)
            return deleteFolder(folder)
        }).then(response => {
            //console.log(response)
            return Modulo.destroy({
                where: {
                        id_modulo: id_modulos
                        }
                })
        })
        .then(response => {
            console.log(response)
            return catCursos.destroy({
                where: {
                        id_curso: id_curso
                        }
                })
        })
        .then(response => {
            console.log(response)
            return res.status(200).json({message: `Se han eliminado todas los archivos del folder, el folder en cloudinary, los modulos del curso y el curso ${folder} de la DDBB`});
        })
        .catch(error => {
            return res.status(400).json({Error: `Error eliminando curso - ${error.name}: ${error.message}`});
        })     

};


    