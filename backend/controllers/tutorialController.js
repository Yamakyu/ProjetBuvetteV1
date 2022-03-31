const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// ---------- POST ----------- Create and Save a new Tutorial
exports.create = (req, res) => {
  console.log("Request reçue");

  if (!req.body.title) {
    res.status(400).send({
      message: "Error : Tutorial is empty !",
    });
    return;
  }

  // Create (or get) a Tutorial (if it has already been created)
  const thatNewTutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false, //← Par défaut, le tuto est pas publié
  };

  // Save Tutorial in the database --- usese a promise
  Tutorial.create(thatNewTutorial)
    .then((data) => {
      res.send(data); //This is where the magic happens
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Couldn't add the Tutorial.",
      });
    });
};
