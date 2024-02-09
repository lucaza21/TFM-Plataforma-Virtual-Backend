//import SQL-db-config

module.exports = (sequelize, DataTypes) => {
    const materialDidactico = sequelize.define('material_didactico',{
        id_material_didactico: {
            type:DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        id_modulo: {
            type:DataTypes.BIGINT,
            allowNull:false
        },
        ruta_material_didactico: {
            type:DataTypes.STRING,
            allowNull:false
        }
    })
    return materialDidactico;
}
// const [sequelize] = require("../SQL/sql.connection.platvirt");
// const {DataTypes} = require('sequelize');

