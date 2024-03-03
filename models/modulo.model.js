//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Modulo = sequelize.define(
    'modulos',
    {
    id_modulo: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    id_curso: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    nombre_modulo: {
        type:DataTypes.STRING,
        allowNull:false
    },
    objetivo_particular: {
        type:DataTypes.STRING,
        allowNull:false
    },
    horas: {
        type:DataTypes.INTEGER,
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
    ruta_material_didactico: {
        //type:DataTypes.ARRAY(DataTypes.STRING),
        type:DataTypes.STRING,
        allowNull:false
    },   
},
{
    tableName: "modulos",
    timestamps: false,
    underscore: true,
  },
)

/* Modulo.sync().then((data) => {
    console.log("Table Modulos and model synced successfully")
  }).catch((error) =>{
    console.log("Error syncing the table and model", error);
  }) */


module.exports = Modulo


