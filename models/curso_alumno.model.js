//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const CursoAlumno = sequelize.define(
    'curso_alumno',
    {
    id_curso_alumno: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    id_curso: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    id_alumno: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    calificacion_global: {
      type:DataTypes.FLOAT,
      allowNull:false
  },
},
{
    tableName: "curso_alumno",
    timestamps: false,
    underscore: true,
  },
)

CursoAlumno.sync().then((data) => {
    console.log("Table CuroSlumno and model synced successfully")
  }).catch((error) =>{
    console.log("Error syncing the table and model", error);
  })


module.exports = CursoAlumno


