//import model
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");
const Alumno = require("../models/alumno.model");
const CatCurso = require("../models/catcurso.model");

const CursoAlumno = require("../models/curso_alumno.model");



module.exports.listar_curso_alumno = (req, res, next) => {
    //console.log(req.body)
    CursoAlumno.findAll(
           
        { 
            where: {id_alumno: 2 },
            include: ["cat_cursos","alumno"], 
            attributes:['id_curso_alumno','id_curso','id_alumno'], raw:true}
        ).then(response => {
            //console.log(response)
            return res.status(200).json(response)
            //res.send("listando cursos desde SQL")
        })
        .catch((error) => {
            return res.status(400).json({message: `Error listando curso_alumno : ${error.message}`});
        });
     
};

module.exports.crear_curso_alumno = (req, res, next) => {
    //console.log(req.body)
    const body = req.body;
    console.log(body)

    //crear nuevo curso
    CursoAlumno.create(body)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando curso: ${error.message}`});
    })

};

module.exports.editar_curso_alumno =(req, res, next) =>{
    const id = req.params.id;

    CursoAlumno.update(req.body,{
        where:{id_curso_alumno: id}
    }).then(value => {
        if(value == 0){
            return res.status(400).json({message:"Curso Alumno no fue actualizado"})
        }else{
            return res.status(202).json({message: "Curso alumno fueron actualizado."});
        }
    }).catch(error =>{
        return res.status(500).json({message: "Error actualizando Curso Alumno "+ error.message});
    });

};

module.exports.eliminar_curso_alumno = (req, res, next) => {
    const id = req.params.id
    CursoAlumno.destroy({
        where: {
            id_curso_alumno: id 
               }
    }).then(rowDeleted => {
        if(rowDeleted === 0){
            return res.status(404).json({message: "Curso alumno no existe"});
        } else {
            return res.status(200).json({message: "Curso alumno eliminado"});
        }
    }) // rowDeleted will return number of rows deleted
    .catch((error) =>{
        return res.status(400).json({ message: `Error eliminando curso alumno: ${error.message}`});
    })
};

 module.exports.bulk_curso_alumno = (req, res, next) => {
    let bulk = [
            {
                "id_curso": 10,
                "id_alumno": 1,
                "calificacion_global": 5.5
            },
            {
                "id_curso": 9,
                "id_alumno": 3,
                "calificacion_global": 5.5
            },
            {
                "id_curso": 11,
                "id_alumno": 2,
                "calificacion_global": 5.5
            },
            {
                "id_curso": 13,
                "id_alumno": 3,
                "calificacion_global": 5.5
            },
            {
                "id_curso": 13,
                "id_alumno": 2,
                "calificacion_global": 5.5
            },
        ]
    //crear nueva curso
    CursoAlumno.bulkCreate(bulk)
    .then((curso) => {
        return res.status(201).json( { curso:curso } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando cursos: ${error}`});
    })
    
}; 

/*
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
    
