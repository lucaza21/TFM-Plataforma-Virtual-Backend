const {DataTypes, Sequelize} = require("sequelize");

const sequelize = new Sequelize(
'plataforma_virtual',
'root',
'123456abc.',
{
host: 'localhost',
dialect: 'mysql'
}
);

sequelize.authenticate().then(() => {
    console.log('SQL Connection Platf_virtual has been established successfully.');
    }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
    });


const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.materialdidactico = require('./materialdidactico.model')(sequelize, DataTypes)
db.catcursos = require('./catcursos.model')(sequelize, DataTypes)

db.sequelize.sync({force:false}).then(() =>{
    console.log('re-sync done!');
})

// db.materialdidactico.hasMany(db.reviews,{
//     foreignKey: 'id_modulo',
//     as:'review'
// })

module.exports = db;
