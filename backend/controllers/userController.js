const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = db.users;
const Op = db.Sequelize.Op;

// ---------- POST -----------
exports.addUser = async (req, res) => {
  console.log("------ USER controller : addUser -------");

  //   const thatNewUser = {
  //     login: req.body.login,
  //     nom: req.body.nom,
  //     prenom: req.body.nom,
  //     password: req.body.password,
  //   };

  //User.create(thatNewUser)
  await User.create(req.body)
    .then((data) => {
      res.status(500).json({
        message: "Inscription réussie",
        addedUser: data,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Inscription impossible : " + err });
    });
};

//------------- GET --------------
exports.login = async (req, res) => {
  console.log("------ USER controller : login -------");

  try {
    const userLogin = req.body.login;

    let thatUser = await User.findOne({ where: { login: userLogin } });

    //Si aucun utilisateur ne correspond
    if (!thatUser) {
      res
        .status(500)
        .json({ message: "WESH Combinaison login/password incorrecte" });
    } else {
      let userMatch = await bcrypt.compare(
        req.body.password,
        thatUser.password
      );

      //Si le mot de passe n'est pas bon
      if (!userMatch) {
        res
          .status(500)
          .json({ message: "Combinaison login/password incorrecte" });
      } else {
        res.status(200).json({ message: "So far so good" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Connexion impossible : " + err });
  }
};
