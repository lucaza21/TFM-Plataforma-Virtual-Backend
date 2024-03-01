//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Entrega = sequelize.define(
    'entrega_actividades',
    {
    id_entrega: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    id_actividad: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    id_alumno: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    fecha_entrega: {
        type:DataTypes.DATE,
        allowNull:false
    },
    ruta_entrega: {
        //type:DataTypes.ARRAY(DataTypes.STRING),
        type:DataTypes.STRING,
        allowNull:false
    },
    comentario_entrega: {
        type:DataTypes.STRING,
        allowNull:false
    },   
},
{
    tableName: "entrega_actividades",
    timestamps: false,
    underscore: true,
  },
)

Entrega.sync().then((data) => {
    console.log("Table Entregas and model synced successfully")
  }).catch((error) =>{
    console.log("Error syncing the table Entregas and model", error);
  })


module.exports = Entrega


