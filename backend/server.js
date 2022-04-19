require("dotenv").config();

const express = require("express");
const monApp = express();
const db = require("./models");
const cors = require("cors");
const PORT = process.env.PORT || 8081;
//global.__basedir = __dirname;

var corsOptions = { origin: "http://localhost:8081/" };
monApp.use(cors(corsOptions));

//On l'utilise pour initialiser les admin
const userController = require("./controllers/userController");

//Parsing des requêtes back end.
monApp.use(express.json());
monApp.use(express.urlencoded({ extended: true }));

monApp.use("/images", express.static("images"));

const RouteUser = require("./Routes/RouteUser");
const RouteTest = require("./Routes/RouteTest");
const RouteArticle = require("./Routes/RouteArticle");

db.sequelize.sync();

//Redirection des requêtes
//monApp.use("/api/tutorials", RouteTutorial);
monApp.use("/api/users", RouteUser);
monApp.use("/api/test", RouteTest);
monApp.use("/api/articles", RouteArticle);

monApp.use("/api/init", userController.checkAdmins);
monApp.use("/api/reset", userController.isLoggedIn, (req, res) => {
  db.sequelize
    .sync({ force: true })
    .then(() => {
      console.log("DROP and re-sync db.");
    })
    .catch((err) => console.log(`Error while dropping/syncing db : ${err}`));

  return res.status(200).json({
    message: "Database droped",
    needLogout: false,
  });
});

//On écoute le port 8080 pour les requêtes
monApp.listen(PORT, () => {
  console.log(`Listenning to port ${PORT}.`);
});
