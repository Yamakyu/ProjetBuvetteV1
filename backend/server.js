require("dotenv").config();

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8081;
const monApp = express();

var corsOptions = { origin: "http://localhost:8081/" };
monApp.use(cors(corsOptions));

//On l'utilise pour initialiser les admin
const userController = require("./controllers/userController");

//Parsing des requêtes back end.
monApp.use(express.json());
monApp.use(express.urlencoded({ extended: true }));

const RouteUser = require("./Routes/RouteUser");

const db = require("./models");
//En production : ↓
db.sequelize.sync();
//En développement : ↓
/*
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Drop and re-sync db.");
  })
  .catch((err) => console.log(`Error while dropping/syncing db : ${err}`));
  */

//Redirection des requêtes
//monApp.use("/api/tutorials", RouteTutorial);
monApp.use("/api/users", RouteUser);
monApp.use("/api/init", userController.checkAdmins);
monApp.use("/api/reset", () => {
  db.sequelize
    .sync({ force: true })
    .then(() => {
      console.log("DROP and re-sync db.");
    })
    .catch((err) => console.log(`Error while dropping/syncing db : ${err}`));
});

//On écoute le port 8080 pour les requêtes
monApp.listen(PORT, () => {
  console.log(`Listenning to port ${PORT}.`);
});
