//import SQL-db-config

module.exports = (sequelize, DataTypes) => {
    const profesor = sequelize.define('profesor',{
        id_profesor: {
            type:DataTypes.BIGINT,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        nombre: {
            type:DataTypes.BIGINT,
            allowNull:false
        },
        ap_paterno: {
            type:DataTypes.STRING,
            allowNull:false
        },
        ap_materno: {
            type:DataTypes.STRING,
            allowNull:false
        },
        correo: {
            type:DataTypes.STRING,
            allowNull:false
        },
        celular: {
            type:DataTypes.STRING,
            allowNull:false
        },
        usuario: {
            type:DataTypes.STRING,
            allowNull:false
        }
       
    })
    return profesor;
}
// id_profesor bigint NOT NULL AUTO_INCREMENT,
//     nombre VARCHAR(100) NOT NULL,
//     ap_paterno VARCHAR(150),
//     ap_materno VARCHAR(150),
//     correo VARCHAR(150),
//     celular VARCHAR(150),
//     fecha_registro TIMESTAMP NOT NULL,
//      usuario VARCHAR(150),