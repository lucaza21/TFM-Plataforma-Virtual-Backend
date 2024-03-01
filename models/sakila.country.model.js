//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.sakila");

const Country = sequelize.define(
  "country",
  {
    country_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    country: {
      type: DataTypes.STRING,
    },
    last_update: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "country",
    timestamps: false,
  }
);

module.exports = Country