//import model
//const [sequelize, connection] = require("../SQL/sql.connection.platvirt");
const Personas = require("../models/platf.personas.model")


module.exports.listar_personas = (req, res, next) => {
    //console.log(req.body)
    Personas.findAll(
        { attributes:['id', 'nombre', 'ap_paterno', 'ap_materno', 'correo_personal', 'celular'], raw:true}
        ).then(response => {
            //console.log(response)
            res.json(response)
            //res.send("listando personas desde SQL")
        })
    .catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
     
};

module.exports.crear_persona = (req, res, next) => {
    const body = req.body;
    //console.log(body)

    //crear nueva persona
    Personas.create(body)
    .then((persona) => {
        return res.status(201).json( { persona:persona } )
    })
    .catch((error) =>{
        return res.status(400).json({ message: `Error creando persona: ${error}`});
    })
    
};

module.exports.eliminar_persona = (req, res, next) => {
    const id = req.params.id
    Personas.destroy({
        where: {
                id: id 
               }
    }).then(rowDeleted => {
        if(rowDeleted === 1){
            return res.status(204).json({message: "eliminado satisfactorio"});
        } else {
            return res.status(404).json({message: "Persona no existe"});
        }
    }) // rowDeleted will return number of rows deleted
    .catch((error) =>{
        return res.status(400).json({ message: `Error eliminando persona: ${error}`});
    })


}
/* 
module.exports.list_actor = (req, res, next) => {
    //console.log(req.body)
    sequelize.sync().then(() => {
        Actor.findAll(
            { attributes:['actor_id', 'first_name', 'last_name'], raw:true}
            ).then(response => {
                //console.log(response)
                res.json(response)
            })
        .catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
        });
    
};

module.exports.list = (req, res) => {
    Post.find()
        .then((posts)=>{
            return res.status(200).json(posts);
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error listing post: ${error}`});
        }) 
};


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

module.exports.delete= (req, res) => {
    const id = req.params.id;
    Post.findByIdAndDelete(id)
        .then((post)=>{
            if(post){
                return res.status(204).json();
            } else{
                return res.status(404).json({message: "Post doesnt exist"});
            }
        })
        .catch((error) =>{
            return res.status(400).json({ message: `Error listing post: ${error}`});
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