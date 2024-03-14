const { uploadFolder, deleteImage, uploadImage, deleteAllImages, deleteFolder } = require("../cloudinary");
const fs = require('fs-extra');

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

    const id_alumno = req.params.id_alumno
    const id_actividad = req.params.id_actividad
    //const body = req.body;
    console.log(req.file)
    console.log(req.body)

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
                throw new Error("Ya hay una Actividad con ese nombre, las actividades no pueden tener el mismo nombre")
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
            }
            
            const id_actividad = 12
            const id_alumno = 3
            const fecha_entrega = new Date()
            const comentario_entrega = req.body.coment
            const ruta_entrega = [newArchivo[0].archivos[newArchivo[0].archivos.length -1]]

            const newEntrega = {
                id_actividad, 
                id_alumno, 
                fecha_entrega, 
                comentario_entrega, 
                ruta_entrega
            }
            console.log(newEntrega)
            Entrega.create(newEntrega)
        }).then(responsEntrega => {
            if(responseEntrega=== null){
                throw new Error("No se pudo crear la actividad")
            }
            return res.status(201).json( {message:`Se ha subido el archivo ${req.file.originalname} a la carpeta ${ruta}`, curso: responseActividad } )
        }).catch(error => {
            fs.unlink(req.file.path)
            return res.status(400).json({Error: `Error subiendo el archivo - ${error.name}: ${error.message}`});
        })


    //console.log(body)

    //crear nuevo curso
    /* Entrega.create(body)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando Entrega: ${error.message}`});
    }) */
     
};

module.exports.editar_entrega =(req, res, next) =>{
    const id = req.params.id;

    Entrega.update(req.body,{
        where:{id_entrega: id}
    }).then(value => {
        if(value == 0){
            return res.status(400).json({message:"Entrega no fue actualizado."})
        }else{
            return res.status(202).json({message: "Entrega alumno fueron actualizado."});
        }
    }).catch(error =>{
        return res.status(500).json({message: "Error actualizando Entrega. "+ error.message});
    });

};

module.exports.eliminar_entrega = (req, res, next) => {
    const id = req.params.id
    Entrega.destroy({
        where: {
            id_entrega: id 
               }
    }).then(rowDeleted => {
        if(rowDeleted === 0){
            return res.status(404).json({message: "Entrega no existe"});
        } else {
            return res.status(200).json({message: "Entrega eliminado"});
        }
    }) // rowDeleted will return number of rows deleted
    .catch((error) =>{
        return res.status(400).json({ message: `Error eliminando Entrega: ${error.message}`});
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

