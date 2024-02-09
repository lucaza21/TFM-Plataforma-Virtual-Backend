// //import model
// const [DataTypes, sequelize] = require("../SQL/sql.connection.sakila");
// const Country = require("../models/sakila.country.model")
// const Actor = require("../models/sakila.actor.model")

// module.exports.list_country = (req, res, next) => {
//     //console.log(req.body)
//     sequelize.sync().then(() => {
//         Country.findAll(
//             { attributes:['country_id', 'country'], raw:true}
//             ).then(response => {
//                 //console.log(response)
//                 res.json(response)
//             })
//         .catch((error) => {
//             console.error('Failed to retrieve data : ', error);
//         });
//     }).catch((error) => {
//         console.error('Unable to create table : ', error);
//         });
    
// };

// module.exports.list_actor = (req, res, next) => {
//     //console.log(req.body)
//     sequelize.sync().then(() => {
//         Actor.findAll(
//             { attributes:['actor_id', 'first_name', 'last_name'], raw:true}
//             ).then(response => {
//                 //console.log(response)
//                 res.json(response)
//             })
//         .catch((error) => {
//             console.error('Failed to retrieve data : ', error);
//         });
//     }).catch((error) => {
//         console.error('Unable to create table : ', error);
//         });
    
// };
// /* 
// module.exports.list = (req, res) => {
//     Post.find()
//         .then((posts)=>{
//             return res.status(200).json(posts);
//         })
//         .catch((error) =>{
//             return res.status(400).json({ message: `Error listing post: ${error}`});
//         }) 
// };


// module.exports.detail = (req, res) => {
//     const id = req.params.id;
//     Post.findById(id)
//         .then((post)=>{
//             if(post){
//                 return res.status(200).json(post);
//             } else{
//                 return res.status(404).json({message: "Post doesnt exist"});
//             }
//         })
//         .catch((error) =>{
//             return res.status(400).json({ message: `Error listing post: ${error}`});
//         })
// }

// module.exports.update = (req, res) => {
//     const id = req.params.id;
//     const body = req.body;
//     Post.findByIdAndUpdate(id, body,{
//         new: true,
//         runValidators: true
//     })
//         .then((post)=>{
//             if(post){
//                 return res.status(200).json(post);
//             } else{
//                 return res.status(404).json({message: "Post doesnt exist"});
//             }
//         })
//         .catch((error) =>{
//             return res.status(400).json({ message: `Error updating post: ${error}`});
//         })
// }

// module.exports.delete= (req, res) => {
//     const id = req.params.id;
//     Post.findByIdAndDelete(id)
//         .then((post)=>{
//             if(post){
//                 return res.status(204).json();
//             } else{
//                 return res.status(404).json({message: "Post doesnt exist"});
//             }
//         })
//         .catch((error) =>{
//             return res.status(400).json({ message: `Error listing post: ${error}`});
//         })
// }

// //-------------------------------------------------------------------------------------------
// module.exports.filter = (req, res) => {

//     const criteria = {};
//     const filter = req.query.author;
//     if(filter){
//         criteria.author = new RegExp(req.query.author, "i");
//     }
//     Post.find(criteria)
//         .then((posts)=>{
//             if(posts.length > 0){
//                 return res.status(200).json(posts);
//             } else{
//                 return res.status(404).json({message: "Author doesnt exist"});
//             }
//         })
//         .catch((error) =>{
//             return res.status(400).json({ message: `Error listing post: ${error}`});
//         })
// }; */