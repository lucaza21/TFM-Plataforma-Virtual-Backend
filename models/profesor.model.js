//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Profesor = sequelize.define(
  "profesor",
  {
    id_profesor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false 
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
  { indexes: [{unique: true, fields: ["correo", "usuario"]}]},
  {
    tableName: "profesor",
    timestamps: false,
  }
);


Profesor.sync().then((data) => {
  console.log("Table Profesor and model synced successfully")
}).catch((error) =>{
  console.log("Error syncing the table and model", error);
})

module.exports = Profesor

// id_profesor bigint NOT NULL AUTO_INCREMENT,
//     nombre VARCHAR(100) NOT NULL,
//     ap_paterno VARCHAR(150),
//     ap_materno VARCHAR(150),
//     correo VARCHAR(150),
//     celular VARCHAR(150),
//     fecha_registro TIMESTAMP NOT NULL,
//      usuario VARCHAR(150),