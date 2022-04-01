require("dotenv").config();

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8081;
const monApp = express();

var corsOptions = { origin: "http://localhost:8081/" };
monApp.use(cors(corsOptions));

//Parsing des requêtes back end.
monApp.use(express.json());
monApp.use(express.urlencoded({ extended: true }));

const RouteTutorial = require("./Routes/RouteTutorial");
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

//Ceci ira en router après
monApp.get("/", (req, res) => {
  res.json({ message: "Welcome to Yamakyu application." });
});

//Redirection des requêtes
monApp.use("/api/tutorials", RouteTutorial);
monApp.use("/api/users", RouteUser);

//On écoute le port 8080 pour les requêtes
monApp.listen(PORT, () => {
  console.log(
    `Listenning to port ${PORT}. Penser à configurer le .ENV pour l'ordi de test`
  );
});
