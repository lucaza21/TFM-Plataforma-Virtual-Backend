//import model
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");
const { uploadFolder, uploadImage, deleteFolder, deleteAllImages, deleteImage} = require("../cloudinary");
const fs = require('fs-extra');

const Profesor = require("../models/profesor.model");
const Alumno = require("../models/alumno.model");
const catCursos = require("../models/catcurso.model");
const CursoAlumno = require("../models/curso_alumno.model");
const Modulo = require("../models/modulo.model");


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
                        attributes: ["nombre_modulo"]    
                    },
                ], 
            attributes:['id_curso','id_profesor', 'titulo', 'nombre_disenador', 'objetivo', 'introduccion', 'metodologia', 'ruta_material_didactico',
                        'perfil_ingreso','insumos','evaluacion', 'horas', 'semanas'], raw:true}
        ).then(response => {
            //console.log(response)
            return res.status(200).json(response)
            //res.send("listando cursos desde SQL")
        })
        .catch((error) => {
            return res.status(400).json({message: `Error listando cursos : ${error.message}`});
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
    const body = req.body;
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
            return body
        }).then(newCurso => {
            //console.log(response)
            //console.log(newCurso)
            return catCursos.create(newCurso)
        }).then(response => {
            if(response === null){
                throw new Error("No se pudo crear el curso")
            }
            //console.log(response.dataValues)
            deleteImage(response.ruta_material_didactico[0].public_id)
            return res.status(201).json( {message:' se ha creado el curso', curso: response } )
        }).catch((error) =>{
            return res.status(400).json({ message: `Error creando curso: - ${error.name}: ${error.message}`});
        })

    
};

module.exports.subirArchivos = async (req, res, next) => {
    const id = req.params.id
    //console.log(req?.file)
    if (req?.file){
        catCursos.findOne(
            { 
                where: {id_curso: id},
                attributes:['id_curso','id_profesor', 'titulo', 'ruta_material_didactico'],
                raw: true 
            }).then(curso => {
                //console.log(curso)
                if(curso === null){
                    throw new Error("El curso mencionado no existe")
                }
                //ruta = JSON.parse(curso.ruta_material_didactico)[0].folder
                ruta = curso.ruta_material_didactico[0].folder
                //console.log(ruta)
                return uploadImage(req.file.path, ruta, req.file.originalname)
            }).then(response => {
                //console.log(response)
                fs.unlink(req.file.path)
                return res.status(200).json({message: `Se ha subido el archivo ${req.file.originalname} a la carpeta ${ruta}`});
            }).catch(error => {
                //console.log({message: `Error subiendo el archivo - ${error.name}: ${error.message}`})
                fs.unlink(req.file.path)
                return res.status(400).json({Error: `Error subiendo el archivo - ${error.name}: ${error.message}`});
            })
        }
        else{
            return res.status(400).json({Error: `Error subiendo el archivo - si seleccionó un archivo? `});
        }
    //
};

module.exports.eliminar_catCursos = async (req, res, next) => {
    const id = req.params.id
    catCursos.findOne(
        { 
            where: {id_curso: id},
            attributes:['id_curso','id_profesor', 'titulo', 'ruta_material_didactico'],
            raw: true 
        }).then(curso => {
            if(curso === null){
                throw new Error("El curso mencionado no existe")
            }
            //console.log(curso)
            //folder = JSON.parse(curso.ruta_material_didactico)[0].folder
            //public_id = JSON.parse(curso.ruta_material_didactico)[0].public_id
            folder = curso.ruta_material_didactico[0].folder
            public_id = curso.ruta_material_didactico[0].public_id
            
            return deleteAllImages(folder)
        }).then(resposne => {
            return deleteFolder(folder)
        }).then(response => {
            catCursos.destroy({
                where: {
                        id_curso: id
                        }
                })
        })
        .then(response => {
            return res.status(200).json({message: `Se han eliminado todas los archivos del folder, el folder y el curso de la DDBB ${folder}`});
        })
        .catch(error => {
            return res.status(400).json({Error: `Error eliminando curso - ${error.name}: ${error.message}`});
        })
      
    /* catCursos.destroy({
        where: {
                id_curso: id
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
        }) */        

};  
    
/*
module.exports.detail = (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then((post)=>{
            if(post){
                return res.status(200).json(post);
            } else{
                return res.status(404).json({message: "Post doesnt exist"});
            }
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error listing post: ${error}`});
        })
}

module.exports.update = (req, res) => {
    const id = req.params.id;
    const body = req.body;
    Post.findByIdAndUpdate(id, body,{
        new: true,
        runValidators: true
    })
        .then((post)=>{
            if(post){
                return res.status(200).json(post);
            } else{
                return res.status(404).json({message: "Post doesnt exist"});
            }
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error updating post: ${error}`});
        })
}



//-------------------------------------------------------------------------------------------
module.exports.filter = (req, res) => {

    const criteria = {};
    const filter = req.query.author;
    if(filter){
        criteria.author = new RegExp(req.query.author, "i");
    }
    Post.find(criteria)
        .then((posts)=>{
            if(posts.length > 0){
                return res.status(200).json(posts);
            } else{
                return res.status(404).json({message: "Author doesnt exist"});
            }
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error listing post: ${error}`});
        })
}; */