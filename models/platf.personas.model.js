//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const Personas = sequelize.define(
  "personas",
  {
    id: {
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
    correo_personal: {
      type: DataTypes.STRING,
      allowNull: false
      
    },
    celular: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false
      
    }, 
    extension: {
      type: DataTypes.STRING,
      allowNull: false
      
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  },
  {
    tableName: "personas",
    timestamps: false,
  }
);

module.exports = Personas