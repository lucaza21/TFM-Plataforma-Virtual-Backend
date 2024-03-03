//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.platvirt");

const CatCurso = sequelize.define(
    'cat_cursos',
    {
    id_curso: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    id_profesor: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    titulo: {
        type:DataTypes.STRING,
        allowNull:false,
        unique: {
            name: 'email',
            msg: 'Oops. Looks like you already have an account with this email address. Please try to login.',
          },
    },
    nombre_disenador: {
        type:DataTypes.STRING,
        allowNull:false
    },
    objetivo: {
        type:DataTypes.STRING,
        allowNull:false
    },
    introduccion: {
        type:DataTypes.STRING,
        allowNull:false
    },
    metodologia: {
        type:DataTypes.STRING,
        allowNull:false
    },
    ruta_material_didactico: {
        type:DataTypes.JSON,
        //type:DataTypes.STRING,
        //allowNull:false
    },
    perfil_ingreso: {
        type:DataTypes.STRING,
        allowNull:false
    },
    insumos: {
        type:DataTypes.STRING,
        allowNull:false
    },
    evaluacion: {
        type:DataTypes.STRING,
        allowNull:false
    },
    horas: {
        type:DataTypes.BIGINT,
        allowNull:false
    },
    semanas: {
        type:DataTypes.BIGINT,
        allowNull:false
    }
},
{indexes: [{unique: true, fields: ["titulo"]}]},
{
    tableName: "cat_cursos",
    timestamps: false,
    underscore: true,
    
  },
  
)

//CatCurso.sync({ alter: true }).then((data) => {


/* CatCurso.sync().then((data) => {
    console.log("Table Catcursos and model synced successfully")
  }).catch((error) =>{
    console.log("Error syncing the table and model", error);
  }) */


module.exports = CatCurso

// id_curso bigint NOT NULL AUTO_INCREMENT,
//     id_profesor bigint NOT NULL,
//     titulo VARCHAR(100) NOT NULL,
//     nombre_disenador VARCHAR(150) NOT NULL,
//     objetivo VARCHAR(500),
//     introduccion VARCHAR(500),
//     metodologia VARCHAR(300),
//     ruta_material_didactico VARCHAR(1000),
//     perfil_ingreso VARCHAR(200),
//     insumos VARCHAR(250),
//     evaluacion VARCHAR(150),
//     horas TIMESTAMP NOT NULL,
//     semanas integer,
