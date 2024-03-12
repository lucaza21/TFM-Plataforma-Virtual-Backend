//import model
const { uploadFolder, uploadImage, deleteImage, deleteAllImages, deleteFolder } = require("../cloudinary");
const fs = require('fs-extra');

const Modulo = require('../models/modulo.model')
const Profesor = require("../models/profesor.model");
const CursoAlumno = require("../models/curso_alumno.model");
const Alumno = require("../models/alumno.model");
const catCursos = require("../models/catcurso.model");


module.exports.listar_modulo = (req, res, next) => {
    //console.log(req.body)
    Modulo.findAll(   
        { 
            //where: {id_curso: 2 },
            include: {
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
            return body
        }).then(newModulo => {
            console.log("newModulo: ",newModulo)
            return Modulo.create(newModulo)
        }).then(response => {
            if(response === null){
                throw new Error("No se pudo crear el modulo")
            }
            //console.log(response.dataValues)
            deleteImage(response.ruta_material_didactico[0].public_id)
            return res.status(201).json( {message:' se ha creado el modulo', curso: response } )
        }).catch((error) =>{
            return res.status(400).json({ message: `Error creando modulo: - ${error.name}: ${error.message}`});
        })
        
    /* Modulo.create(body)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando modulo: ${error.message}`});
    }) */
     
};

module.exports.subirArchivos = (req, res, next) => {
    const id = req.params.id
    if (req.file == null) {
        return res.status(400).json({Error: `Error subiendo el archivo - No se seleccionó ningún archivo. `});
    }

    oName = req.file.originalname.split('.')[0]
    Modulo.findOne(
        { 
            where: {id_modulo: id},
            attributes:['id_modulo','id_curso', 'nombre_modulo', 'ruta_material_didactico'],
            raw: true 
        }).then(modulo => {

            if(modulo === null){
                throw new Error("El modulo mencionado no existe")
            }
            return modulo
        }).then(response =>{
            data = response.ruta_material_didactico
            ruta = response.ruta_material_didactico[0].folder
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

module.exports.eliminar_modulo = async (req, res, next) => {
    const id = req.params.id
    Modulo.findOne(
        { 
            where: {id_modulo: id},
            attributes:['id_modulo','id_curso', 'nombre_modulo', 'ruta_material_didactico'],
            raw: true 
        }).then(curso => {
            if(curso === null){
                throw new Error("El curso mencionado no existe")
            }
            //console.log(curso)
            //folder = JSON.parse(curso.ruta_material_didactico)[0].folder
            //public_id = JSON.parse(curso.ruta_material_didactico)[0].public_id
            //public_id = curso.ruta_material_didactico[0].public_id
            folder = curso.ruta_material_didactico[0].folder
    
            return deleteAllImages(folder)
        }).then(resposne => {
            return deleteFolder(folder)
        }).then(response => {
            Modulo.destroy({
                where: {
                        id_modulo: id
                        }
                })
        })
        .then(response => {
            return res.status(200).json({message: `Se han eliminado todas los archivos del folder, el folder y el curso ${folder} de la DDBB`});
        })
        .catch(error => {
            return res.status(400).json({Error: `Error eliminando curso - ${error.name}: ${error.message}`});
        })     

};

module.exports.editar_modulo = (req, res )=>{

    const id = req.params.id;
    body = req.body
    console.log(body)
    archivos = body.ruta_material_didactico[0].archivos
    Modulo.update({
        ruta_material_didactico:
        [
            {
              url: 'http://res.cloudinary.com/dm9hihcwt/image/upload/v1710209185/INTRO%20REACT/modulo%201/modulo%201.pdf',
              folder: 'INTRO REACT/modulo 1',
              //archivos: ["hola" ,"2", "http.pdf"],
              archivos: [],
              public_id: 'INTRO REACT/modulo 1/modulo 1'
            }
          ]
        }, {
        where: {
            id_modulo: id
        },
    }).then(updated =>{
        if(updated == 0){
            return res.status(400).json({message: "Registro no fue actualizado."});
        }else{
            return res.status(200).json({message: "El modulo fue actualizado correctamente.", updated});
        }
    }).catch( error =>{
        return res.status(500).json({message: "Error actualizando Modulo: " + error.message});
    });
};



/* module.exports.bulk_Modulo = (req, res, next) => {

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
    Modulo.bulkCreate(cursos)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando cursos: ${error}`});
    })
    
}; 

module.exports.crear_Modulo = (req, res, next) => {
  
    const body = req.body;
    console.log(body)

    //crear nuevo curso
    Modulo.create(body)
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
        Modulo.create(body)
        .then((curso) => {
            return res.status(201).json( { curso:curso } )
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error creando curso: ${error.message}`});
        })
    }
    
};

module.exports.eliminar_Modulo = async (req, res, next) => {
    const id = req.params.id

    await Modulo.findOne(
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
            Modulo.destroy({
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
    
