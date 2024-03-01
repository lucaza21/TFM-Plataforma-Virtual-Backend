//import SQL-db-config
const [DataTypes, sequelize] = require("../SQL/sql.connection.sakila");

const Actor = sequelize.define(
  "country",
  {
    actor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    last_update: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "actor",
    timestamps: false,
  }
);

module.exports = Actor