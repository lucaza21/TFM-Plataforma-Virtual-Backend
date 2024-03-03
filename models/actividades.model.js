//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Actividad = sequelize.define(
    'actividades',
    {
    id_actividad: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    id_modulo: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    nombre_actividad: {
        type:DataTypes.STRING,
        allowNull:false
    },
    ponderacion_actividad: {
        type:DataTypes.FLOAT,
        allowNull:false
    },
    fecha_inicio: {
        type:DataTypes.DATE,
        allowNull:false
    },
    fecha_fin: {
        type:DataTypes.DATE,
        allowNull:false
    },
    ruta_actividad: {
        //type:DataTypes.ARRAY(DataTypes.STRING),
        type:DataTypes.STRING,
        allowNull:false
    },   
},
{
    tableName: "actividades",
    timestamps: false,
    underscore: true,
  },
)

/* Actividad.sync().then((data) => {
    console.log("Table Actividades and model synced successfully")
  }).catch((error) =>{
    console.log("Error syncing the table Actividades and model", error);
  }) */


module.exports = Actividad


