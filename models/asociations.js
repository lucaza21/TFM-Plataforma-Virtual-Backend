const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Alumno = require("./alumno.model");
const Profesor = require("./profesor.model");
const CatCurso = require("./catcurso.model");

Profesor.hasMany(CatCurso, {
    foreignKey: "id_profesor",
    as: 'cursos',
    onDelete: "cascade",
});

CatCurso.belongsTo(Profesor,{
    foreignKey: "id_profesor",
    as: 'profesor'
});


/* sequelize.sync({alter:true}).then((data) => {
    console.log("asociations synced successfully")
  }).catch((error) =>{
    console.log("Error syncing the table and model", error);
  }) */