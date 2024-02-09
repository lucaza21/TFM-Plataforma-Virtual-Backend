// const DataTypes = require("sequelize");

// const sequelize = new DataTypes(
// 'sakila',
// 'root',
// 'root',
// {
// host: 'localhost',
// dialect: 'mysql'
// }
// );

// sequelize.authenticate().then(() => {
//     console.log('SQL Sakila Connection has been established successfully.');
//     }).catch((error) => {
//     console.error('Unable to connect to the database: ', error);
//     });


// module.exports = [DataTypes, sequelize]

// /* const Country = sequelize.define("country", {
//     country_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true
//     },
//     country: {
//     type: DataTypes.STRING,
//     },
//     last_update: {
//     type: DataTypes.DATE,
//     },
//     },
//     {
//     tableName: 'country',
//     timestamps: false
//     });

// sequelize.sync().then(() => {
//     Country.findAll({ attributes:['country_id', 'country'], raw:true}).then(res => {
//     console.log(res)
//     }).catch((error) => {
//     console.error('Failed to retrieve data : ', error);
//     });

// }).catch((error) => {
//     console.error('Unable to create table : ', error);
//     }); */