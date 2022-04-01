const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// ---------- POST ----------- Create and Save a new Tutorial
exports.create = (req, res) => {
  console.log("------ Requête *create* reçue ------- /n");

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
    published: req.body.published == "true" ? true : false, //← Par défaut, le tuto est pas publié
  };

  // Save Tutorial in the database --- uses a promise
  Tutorial.create(thatNewTutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Couldn't add the Tutorial.",
      });
    });
};

//------------- GET -------------- Get all tutorials
exports.findAll = (req, res) => {
  console.log("------ Requête *find all* reçue -------");

  Tutorial.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

//------------- GET -------------- Get tutorials by title
exports.findByTitle = (req, res) => {
  console.log("------ Requête *find by title* reçue ------- /n");

  if (!req.query.title) {
    res.status(400).send({
      message: "Error : can't search for empty title !",
    });
    return;
  }

  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  Tutorial.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

//------------- GET -------------- Get 1 tutorial by id
exports.findById = (req, res) => {
  console.log("------ Requête *find by id* reçue ------- /n");

  const id = req.params.id;
  Tutorial.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

//------------- GET -------------- Get PUBLISHED tutorials
exports.findAllPublished = (req, res) => {
  console.log("------ Requête *find published* reçue ------- /n");
  Tutorial.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

//------------- PUT -------------- Update 1 tutorial by id
exports.update = (req, res) => {
  console.log("------ Requête *update by id* reçue ------- /n");

  const id = req.params.id;
  Tutorial.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      //En réponse de la requête d'update, Sequelize retourne le nombre d'entrées modifiées
      if (num == 1) {
        res.send({ message: "Tutorial was updated successfully." });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Error updating Tutorial with id=${id} : + ${err}`,
      });
    });
};

//------------- DELETE -------------- Update 1 tutorial by id
exports.deleteById = (req, res) => {
  console.log("------ Requête *delete by Id* reçue ------- /n");

  const id = req.params.id;
  Tutorial.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

//------------- DELETE -------------- Delete all
exports.deleteAll = (req, res) => {
  console.log("------ Requête *DELETE ALL* reçue ------- /n");

  Tutorial.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};
