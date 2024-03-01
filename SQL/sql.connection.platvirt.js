const DataTypes = require("sequelize");

const sequelize = new DataTypes(
'plataforma_virtual',
'root',
'root',
{
host: 'localhost',
dialect: 'mysql',
define: {
    timestamps: false,
    freezeTableName: true
  },
},

);

sequelize.authenticate().then(() => {
    console.log('SQL Connection Platf_virtual has been established successfully.');
    }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
    });


module.exports = [DataTypes, sequelize]
