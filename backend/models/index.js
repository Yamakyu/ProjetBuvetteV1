require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const myDbConfig = require("../config/dbConfig.js");
const sequelize = new Sequelize(
  myDbConfig.DB,
  myDbConfig.USER,
  myDbConfig.PASSWORD,
  {
    host: myDbConfig.HOST,
    dialect: myDbConfig.dialect,
    operatorAliases: false,
    pool: {
      max: myDbConfig.pool.max,
      min: myDbConfig.pool.min,
      acquire: myDbConfig.pool.acquire,
      idle: myDbConfig.pool.idle,
    },
  }
);
//↑ Ces paramètres sont récupérés depuis dbConfig.js, via myDbConfig

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//db.tutorials = require("./tutorialsModel.js")(sequelize, Sequelize);
db.users = require("./userModel.js")(sequelize, Sequelize);
//db.pictures = require("./pictureModel")(sequelize, Sequelize);
db.articles = require("./articleModel")(sequelize, DataTypes);
module.exports = db;
