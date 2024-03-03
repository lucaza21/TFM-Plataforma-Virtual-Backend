//import model
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");
const { uploadImage, deleteImage, createFolder } = require("../cloudinary");
const fs = require('fs-extra');

const Profesor = require("../models/profesor.model");
const Alumno = require("../models/alumno.model");
const catCursos = require("../models/catcurso.model");
const CursoAlumno = require("../models/curso_alumno.model");
const Modulo = require("../models/modulo.model");


const localImage = __dirname+'/../assets/cupcake.jpg'


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
/* module.exports.subirArchivos = async (req, res, next) => {

    
    try{
        const result = await createFolder(localImage, "test2")
        console.log(result)
        const body = req.body
        console.log(body)

    } catch(err){
        console.log(err)
    }
    
    res.send('todo ok')
   
    
}; */ 

module.exports.editar_catcurso = (req, res )=>{

    const id = req.params.id;

    catCursos.update(req.body, {
        where: {
            id_curso: id
        }
    }).then(updated =>{
        if(updated == 0){
            return res.status(400).json({message: "Registro no fue actualizado."});
        }else{
            return res.status(200).json({message: "El curso fue actualizado correctamente."});
        }
    }).catch( error =>{
        return res.status(500).json({message: "Error actualizando Curso: " + error.message});
    });
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