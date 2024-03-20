//import model
const { uploadFolder, deleteImage, uploadImage, deleteAllImages, deleteFolder } = require("../cloudinary");
const fs = require('fs-extra');

const Actividad = require('../models/actividades.model')
const CatCursos = require("../models/catcurso.model");
const Profesor = require("../models/profesor.model");
const CursoAlumno = require("../models/curso_alumno.model");
const Alumno = require("../models/alumno.model");
const Modulo = require("../models/modulo.model");
const Entrega = require("../models/entregas.model");
const Calificacion = require("../models/calificaciones.model");


module.exports.listar_actividad = (req, res, next) => {
    //console.log(req.body)
    Actividad.findAll(   
        { 
            //where: {id_curso: 2 },
            include: [
                {
                    model: Modulo,
                    as:'modulos',
                    //required:true,
                    attributes: ["id_modulo","nombre_modulo", "ruta_material_didactico"]
                },
                {
                    model: Entrega,
                    as:'entrega_actividades',
                    //required:true,
                    include:[
                        {
                            model:Alumno,
                            as:'alumno',
                            attributes: ["nombre","correo", "usuario"]
                        },
/*                         {
                            model: Calificacion,
                            as: 'calificaciones',
                        }, */
                    ]
                }
        ], 
            //attributes:['id_Actividad','id_curso','nombre_Actividad',], 
            //raw:true
        }
        ).then(response => {
            //console.log(response)
            return res.status(200).json(response)
            //res.send("listando cursos desde SQL")
        })
        .catch((error) => {
            return res.status(400).json({message: `Error listando Actividad : ${error.message}`});
        });
     
};

module.exports.detalle_actividad = (req, res, next) => {
    //console.log(req.body)
    const id_actividad = req.params.id
    Actividad.findOne(
        { 
            where: {id_modulo: id_actividad},
            //attributes:['id_modulo','id_curso','nombre_modulo',], 
            //raw:true
            include: [
                {
                    model: Modulo,
                    as:'modulos',
                    //required:true,
                    attributes: ["id_modulo","nombre_modulo", "ruta_material_didactico"]
                },
                {
                    model: Entrega,
                    as:'entrega_actividades',
                    //required:true,
                    include:[
                        {
                            model:Alumno,
                            as:'alumno',
                            attributes: ["nombre","correo", "usuario"]
                        },
/*                         {
                            model: Calificacion,
                            as: 'calificaciones',
                        }, */
                    ]
                }
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

module.exports.crear_actividad = (req, res, next) => {
    //console.log(req.body)
    const id_modulo = req.params.id
    const body = req.body;
    body.id_modulo = id_modulo
    console.log(body)

    //crear nueva Actividad
    Modulo.findOne(
        { 
            where: {id_modulo: id_modulo},
            attributes:['id_modulo','id_curso', 'nombre_modulo', 'ruta_material_didactico'],
            raw: true 
        }).then(modulo => {
            //console.log("modulo: ",modulo)
            found = modulo
            if(modulo === null){
                throw new Error("El modulo mencionado no existe")
            }
            return Actividad.findOne({where:{nombre_actividad: body.nombre_actividad, id_modulo:id_modulo}})
        }).then(actividad => {
            //console.log("found: ",found)
            if(actividad !== null){
                throw new Error("El nombre de la actividad mencionada Ya existe para ese modulo - Dos actividades no pueden llevar el mismo Titulo dentro del mismo modulo")
            }
            folder = found.ruta_material_didactico[0].folder
            //console.log(`${folder}/${body.nombre_actividad}`)
            return uploadFolder(`${folder}/${body.nombre_actividad}`, `${body.nombre_actividad}`)
        }).then((responseUploader) => {
            //console.log("responseUploader: ", responseUploader)
            body.ruta_actividad = [{
                public_id: responseUploader.public_id,
                url: responseUploader.url,
                folder: responseUploader.folder,
                archivos: []
            }]
            return body
        }).then(newActividad => {
            console.log("newModulo: ",newActividad)
            return Actividad.create(newActividad)
        }).then(responseActividad => {
            if(responseActividad === null){
                throw new Error("No se pudo crear la actividad")
            }
            //console.log(responseActividad.ruta_actividad[0].public_id)
            deleteImage(responseActividad.ruta_actividad[0].public_id)
            return res.status(201).json( {message:' se ha creado la actividad', curso: responseActividad } )
        }).catch((error) =>{
            return res.status(400).json({ message: `Error creando la actividad: - ${error.name}: ${error.message}`});
        })

    /* Actividad.create(body)
        .then((curso) => {
            return res.status(201).json( { curso:curso } )
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error creando Actividad: ${error.message}`});
        }) */
     
};

module.exports.subirArchivos = (req, res, next) => {
    const id_actividad = req.params.id
    if (req.file == null) {
        return res.status(400).json({Error: `Error subiendo el archivo - No se seleccionó ningún archivo. `});
    }

    oName = req.file.originalname.split('.')[0]
    Actividad.findOne(
        { 
            where: {id_actividad: id_actividad},
            attributes:['id_actividad','id_modulo', 'nombre_actividad', 'ruta_actividad'],
            raw: true 
        }).then(actividad => {
            if(actividad === null){
                throw new Error("La Actividad mencionada no existe")
            }
            data = actividad.ruta_actividad
            ruta = actividad.ruta_actividad[0].folder
            return uploadImage(req.file.path, ruta, oName)
        }).then( uploadResponse => {
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
            return Actividad.update({ ruta_actividad : newArchivo},{
                where: {id_actividad: id_actividad},
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

module.exports.eliminar_actividad = async (req, res, next) => {
    const id_actividad = req.params.id
    Actividad.findOne(
        { 
            where: {id_actividad: id_actividad},
            attributes:['id_actividad','id_modulo', 'nombre_actividad', 'ruta_actividad'],
            raw: true 
        }).then(actividad => {
            if(actividad === null){
                throw new Error("La actividad mencionada no existe")
            }
            folder = actividad.ruta_actividad[0].folder
            return deleteAllImages(folder)
        }).then(response => {
            return deleteFolder(folder)
        }).then(response => {
            Actividad.destroy({
                where: {
                        id_actividad: id_actividad
                        }
                })
        })
        .then(response => {
            return res.status(200).json({message: `Se han eliminado todas los archivos del folder, el folder y la actividad ${folder} de la DDBB`});
        })
        .catch(error => {
            return res.status(400).json({Error: `Error eliminando actividad - ${error.name}: ${error.message}`});
        })     

};

module.exports.editar_actividad = (req, res, next) =>{
    const id_actividad = req.params.id;
    //console.log("TESTING "+ req.body);
    Actividad.update(req.body, {
        where:{id_actividad: id_actividad}
    }).then(value =>{
        if(value == 0){
            return res.status(400).json({message: "No fue posible actualizar la actividad."});
        }else{
            return res.status(202).json({message: "La actividad fue actualizar."});
        }
    }).catch(error =>{
        return res.status(500).json({message: "Error al actualizar actividad " + error.message});
    })
};

/* module.exports.eliminar_actividad =(req,res) =>{
    const id = req.params.id;
    Actividad.destroy({
        where: {id_actividad: id}
    }).then(deleted =>{
        if(deleted === 0){
            return res.status(404).json({message: "Actividad no existe"});
        } else {
            return res.status(202).json({message: "Actividad eliminada"});
        }
    }) // rowDeleted will return number of rows deleted
    .catch((error) =>{
        return res.status(400).json({ message: `Error eliminando actividad: ${error.message}`});
    })
}; */

module.exports.bulk_actividad = (req, res, next) => {
    let bulk = [
        {
            "id_modulo": 1,
            "nombre_actividad": "Actividad_1",
            "ponderacion_actividad": 7.2,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_actividad": "a/una/ruta"
        },
        {
            "id_modulo": 1,
            "nombre_actividad": "Actividad_2",
            "ponderacion_actividad": 7.2,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_actividad": "a/una/ruta"
        },
        {
            "id_modulo": 2,
            "nombre_actividad": "Actividad_1",
            "ponderacion_actividad": 7.2,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_actividad": "a/una/ruta"
        },
        {
            "id_modulo": 3,
            "nombre_actividad": "Actividad_1",
            "ponderacion_actividad": 7.2,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_actividad": "a/una/ruta"
        },
        {
            "id_modulo": 3,
            "nombre_actividad": "Actividad_2",
            "ponderacion_actividad": 7.2,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_actividad": "a/una/ruta"
        },
        {
            "id_modulo": 4,
            "nombre_actividad": "Actividad_1",
            "ponderacion_actividad": 7.2,
            "fecha_inicio": "2024-10-31 01:34:48.81+00",
            "fecha_fin": "2025-10-31 01:34:48.81+00",
            "ruta_actividad": "a/una/ruta"
        },
        
        ]
    //crear nueva curso
    Actividad.bulkCreate(bulk)
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
    
