//import model
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");
const catCursos = require("../models/catcurso.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


module.exports.listar_catCursos = (req, res, next) => {
    //console.log(req.body)
    catCursos.findAll(
        { attributes:['id_curso','id_profesor', 'titulo', 'nombre_disenador', 'objetivo', 'introduccion', 'metodologia', 'ruta_material_didactico',
                        'perfil_ingreso','insumos','evaluacion', 'horas', 'semanas'], raw:true}
        ).then(response => {
            //console.log(response)
            return res.status(200).json(response)
            //res.send("listando cursos desde SQL")
        })
        .catch((error) => {
            return res.status(400).json('Error listando cursos : ', error);
        });
     
};
module.exports.bulk = (req, res, next) => {

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
                horas: "1970-01-01 00:00:01",
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
                horas: "1970-01-01 00:00:01",
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
                horas: "1970-01-01 00:00:01",
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
    //console.log(body)

    //crear nuevo curso
    cursos.create(body)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando curso: ${error}`});
    })
};  
    

/*
module.exports.eliminar_curso = (req, res, next) => {
    const id = req.params.id
    cursos.destroy({
        where: {
                id_curso: id 
               }
    }).then(rowDeleted => {
        if(rowDeleted === 0){
            return res.status(404).json({message: "curso no existe"});
        } else {
            console.log("curso eliminado")
            return res.status(204).json();
        }
    }) // rowDeleted will return number of rows deleted
    .catch((error) =>{
        return res.status(400).json({ message: `Error eliminando curso: ${error}`});
    })


};

*/

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