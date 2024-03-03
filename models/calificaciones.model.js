//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Calificacion = sequelize.define(
    'calificaciones',
    {
    id_calificacion: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    id_entrega: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    calificacion: {
        type:DataTypes.FLOAT,
        allowNull:false
    },
    comentario_calificacion: {
        type:DataTypes.STRING,
        allowNull:false
    },   
},
{
    tableName: "calificaciones",
    timestamps: false,
    underscore: true,
  },
)

/* Calificacion.sync().then((data) => {
    console.log("Table Calificacion and model synced successfully")
  }).catch((error) =>{
    console.log("Error syncing the table Calificacion and model", error);
  })
 */

module.exports = Calificacion


