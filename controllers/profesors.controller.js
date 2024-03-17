//import model
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");
const CatCurso = require("../models/catcurso.model");
const Profesor = require("../models/profesor.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


module.exports.crear_profesor = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) =>{
        req.body.password = hash;
        const body = req.body;
        //console.log(body)

        //crear nuevo profesor
        Profesor.create(body)
        .then((profesor) => {
            return res.status(201).json( { profesor:profesor } )
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error creando profesor: ${error.message}`});
        })
    })   
    
};

module.exports.login_profesor = (req, res) => { 
    Profesor.findOne({
        where: {correo: req.body.correo}
    })
    .then((profesor)=>{
        if(profesor){
            bcrypt.compare(req.body.password, profesor.password).then(match =>{
                if(match){
                    const token = jwt.sign(
                        {sub: profesor.id_profesor, exp: Date.now()/1000 + 3600},
                        "super-secret"
                    );
                    return res.json({token: token})
                    //return res.send({"match": match})
                }
                return res.status(401).json({message: "Unauthorized wrong password"})
            });
        } else{
            return res.status(401).json({message: "Unauthorized profesor doesnt exist"})
        }
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error listing profesor: ${error.message}`});
    }) 
};

module.exports.listar_profesor = (req, res, next) => {
    //console.log(req.body)
    Profesor.findAll(
        {   
            include:
                [{
                model: CatCurso,
                as: 'cat_cursos',
                attributes: ["titulo"]    
                }], 
            attributes:['id_profesor', 'nombre', 'ap_paterno', 'ap_materno', 'correo', 'celular', 'fecha_registro',
                        'usuario','password','status'],
            
        }
        ).then(response => {
            //console.log(response)
            return res.status(200).json(response)
            //res.send("listando Profesor desde SQL")
        })
    .catch((error) => {
        return res.status(400).json({message:`Error listando alumnos : ${error.message}`});
    });
     
};

module.exports.editar_profesor =(req, res, next) =>{
    const id = req.params.id;

    Profesor.update(req.body,{
        where:{id_profesor: id}
    }).then(value => {
        if(value == 0){
            return res.status(400).json({message:"Profesor no fue actualizado"})
        }else{
            return res.status(202).json({message: "Datos del Profesor fueron actualizado."});
        }
    }).catch(error =>{
        return res.status(500).json({message: "Error actualizando Profesor "+ error.message});
    });
};

module.exports.eliminar_profesor = (req, res, next) => {
    const id = req.params.id
    Profesor.destroy({
        where: {
                id: id 
               }
    }).then(rowDeleted => {
        if(rowDeleted === 0){
            return res.status(404).json({message: "profesor no existe"});
        } else {
            console.log("profesor eliminado")
            return res.status(204).json();
        }
    }) // rowDeleted will return number of rows deleted
    .catch((error) =>{
        return res.status(400).json({ message: `Error eliminando profesor: ${error.message}`});
    })


};

module.exports.bulk = (req, res, next) => {

    let bulk = [
            {
                nombre: "profesor1",
                ap_paterno: "apellidoP1",
                ap_materno: "apellidoM1",
                correo: "profesor1@platf.com",
                celular: "0123456789",
                fecha_registro:"2021-10-31 01:34:48.81+00",
                usuario: "user_profesor1",
                password: "secret"
            },
            {
                nombre: "profesor2",
                ap_paterno: "apellidoP2",
                ap_materno: "apellidoM2",
                correo: "profesor2@platf.com",
                celular: "0123456789",
                fecha_registro:"2021-10-31 01:34:48.81+00",
                usuario: "user_profesor2",
                password: "secret"
            },
            {
                nombre: "profesor3",
                ap_paterno: "apellidoP3",
                ap_materno: "apellidoM3",
                correo: "profesor3@platf.com",
                celular: "0123456789",
                fecha_registro:"2021-10-31 01:34:48.81+00",
                usuario: "user_profesor3",
                password: "secret"
            },
        ]
    //crear nueva profesor
    Profesor.bulkCreate(bulk)
    .then((profesor) => {
        return res.status(201).json( { profesor:profesor } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando profesores: ${error.message}`});
    })
    
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