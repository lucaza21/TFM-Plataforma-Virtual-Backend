//import model
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");
const Alumnos = require("../models/alumno.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CatCurso = require("../models/catcurso.model");

module.exports.crear_alumno = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) =>{
        req.body.password = hash;
        const body = req.body;
        //console.log(body)

        //crear nuevo alumno
        Alumnos.create(body)
        .then((alumno) => {
            return res.status(201).json( { alumno:alumno } )
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error creando alumno: ${error.message}`});
        })
    })   
    
};

module.exports.login_alumnos = (req, res) => { 
    Alumnos.findOne({
        where: {correo: req.body.correo}
    })
    .then((alumno)=>{
        if(alumno){
            bcrypt.compare(req.body.password, alumno.password).then(match =>{
                if(match){
                    const token = jwt.sign(
                        {sub: alumno.id_alumno, exp: Date.now()/1000 + 3600},
                        "super-secret"
                    );
                    return res.json({token: token})
                    //return res.send({"match": match})
                }
                return res.status(401).json({message: "Unauthorized wrong password"})
            });
        } else{
            return res.status(401).json({message: "Unauthorized alumno doesnt exist"})
        }
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error listing alumno: ${error.message}`});
    }) 
};

module.exports.listar_alumnos = (req, res, next) => {
    //console.log(req.body)
    Alumnos.findAll(
        { 
            include:
            {
                model: CatCurso,
                as: 'cat_cursos',
                   
            },
            attributes:['id_alumno', 'nombre', 'ap_paterno', 'ap_materno', 'correo', 'celular', 'fecha_registro',
                        'usuario','password','status'], raw:true}
        ).then(response => {
            //console.log(response)
            return res.status(200).json(response)
            //res.send("listando alumnos desde SQL")
        })
        .catch((error) => {
            return res.status(400).json({message: `Error listando alumnos : ${error.message}`});
        });
     
};

module.exports.eliminar_alumno = (req, res, next) => {
    const id = req.params.id
    Alumnos.destroy({
        where: {
                id_alumno: id 
               }
    }).then(rowDeleted => {
        if(rowDeleted === 0){
            return res.status(404).json({message: "alumno no existe"});
        } else {
            console.log("alumno eliminado")
            return res.status(204).json();
        }
    }) // rowDeleted will return number of rows deleted
    .catch((error) =>{
        return res.status(400).json({ message: `Error eliminando alumno: ${error.message}`});
    })
};

module.exports.bulk = (req, res, next) => {

    let alumnos = [
            {
                nombre: "alumno1",
                ap_paterno: "apellidoP1",
                ap_materno: "apellidoM1",
                correo: "alumno1@platf.com",
                celular: "0123456789",
                fecha_registro:"2021-10-31 01:34:48.81+00",
                usuario: "alumno_alumno1",
                password: "secret"
            },
            {
                nombre: "alumno2",
                ap_paterno: "apellidoP2",
                ap_materno: "apellidoM2",
                correo: "alumno2@platf.com",
                celular: "0123456789",
                fecha_registro:"2021-10-31 01:34:48.81+00",
                usuario: "alumno_alumno2",
                password: "secret"
            },
            {
                nombre: "alumno3",
                ap_paterno: "apellidoP3",
                ap_materno: "apellidoM3",
                correo: "alumno3@platf.com",
                celular: "0123456789",
                fecha_registro:"2021-10-31 01:34:48.81+00",
                usuario: "alumno_alumno3",
                password: "secret"
            },
        ]
    //crear nueva alumno
    Alumnos.bulkCreate(alumnos)
    .then((alumno) => {
        return res.status(201).json( { alumno:alumno } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando alumnos: ${error.message}`});
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