//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Alumno = sequelize.define(
  "alumno",
  {
    id_alumno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    ap_paterno: {
      type: DataTypes.STRING,
      allowNull: false
      
    },
    ap_materno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty:{
            args:true,
            msg:"Email-id required"
        },
          isEmail:{
            args:true,
            msg:'Valid email-id required'
        }
      },
      unique: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false
    },
    celular: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
  },
  {
    tableName: "alumno",
    timestamps: false,
    underscore: true,
  },
    
  {indexes: [{unique: true, fields: ["correo"]}]},
);

Alumno.sync().then((data) => {
  console.log("Table Alumnos and model synced successfully")
}).catch((error) =>{
  console.log("Error syncing the table and model", error);
})


module.exports = Alumno