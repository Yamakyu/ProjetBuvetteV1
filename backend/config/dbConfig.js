//↓ Exports qui vont être utilisables dans le reste de l'application
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: process.env.SQL_PW,
  DB: "sequelizetestdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
