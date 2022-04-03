require("dotenv").config();

const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = db.users;
const Op = db.Sequelize.Op;

// ---------- POST -----------
exports.addUser = async (req, res) => {
  console.log("USER controller : addUser -------");

  try {
    //↓ Si l'utilisateur est créé avec des droits particuliers, on vérifie que la requête est bien faite par un admin
    if (
      (req.body.isAdmin ||
        req.body.isGerantBuvette ||
        req.body.isGerantMateriel) &&
      !req.thatRequestToken.isAdmin
    ) {
      return res.status(401).json({
        message: "Token invalide, droits administrateurs requis",
      });
    } else {
      await User.create(req.body)
        .then((data) => {
          res.status(200).json({
            message: "Inscription réussie",
            addedUser: data,
          });
        })
        .catch((err) => {
          res.status(500).json({ message: "Inscription impossible : " + err });
        });
    }
  } catch (err) {
    console.log(`------ Erreur dans addUser :  ${err}`);
    res.status(500).json({ message: "Ajout impossible : " + err });
  }
};

//------------- POST --------------
exports.login = async (req, res) => {
  console.log("USER controller : login -------");

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
        //On ajoute les informations utilisateur ainsi que ses droits dans le token de connexion, pour pouvoir s'en re-servir plus tard dans d'autres API ou en front end
        let newToken = jwt.sign(
          {
            id: thatUser.id,
            nom: thatUser.nom,
            prenom: thatUser.prenom,
            isAdmin: thatUser.isAdmin,
            isGerantBuvette: thatUser.isGerantBuvette,
            isGerantMateriel: thatUser.isGerantMateriel,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "5h",
          }
        );

        res.status(200).json({
          user: thatUser,
          message: "Connexion réussie",
          newToken,
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Connexion impossible : " + err });
  }
};

//------------- GET --------------
exports.isLoggedIn = (req, res, next) => {
  console.log("USER controller : isLoggedIn -------");
  try {
    let requestToken = req.headers.authorization.replace("Bearer ", "");
    //↑ Dans notre requête, notre token se trouve dans une chaîne qui a la forme "Bearer le_token"

    //↓ Le payload ici c'est EXACTEMENT le payload encodé dans le token quand on s'est loggué. C'est pourquoi on utilise process.env.PRIVATE_KEY
    jwt.verify(requestToken, process.env.PRIVATE_KEY, (err, payload) => {
      if (err) {
        throw err;
        //L'exception est gérée dans le catch un peu plus bas
      } else {
        req.thatRequestToken = payload;
        //On ajoute le token à la requête en créant une nouvelle variable.
        //Ainsi, le token est inclus dans la requête, et toute API qui suit isLoggedIn peut l'utiliser. Le token contient aussi l'ID de son utilisateur.

        console.log(`------- Accès autorisé, leToken(extreme)`);
        next();
      }
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(440) //← 440 = session expired
        .json({
          message:
            "Accès refusé, session expirée, veuillez vous reconnecter. " +
            error,
          needLogout: true,
        });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401) //← 401 = unauthorized
        .json({
          message: "Accès refusé, token invalide. " + error,
        });
    } else {
      return res.status(500).json({
        message: "Erreur d'authentification : " + error,
      });
    }
  }
};

//------------- GET --------------
exports.checkAdmins = async (req, res) => {
  console.log("USER controller : checkAdmins -------");

  try {
    let adminsFound = await User.findAll({ where: { isAdmin: true } });

    let adminCount = 0;
    adminsFound.forEach((admin) => {
      adminCount++;
    });

    if (adminCount > 0) {
      res.status(200).json({
        message: "Compte admin prêt",
      });
    } else {
      let newAdmin = {
        login: "admin1",
        password: "root",
        isAdmin: true,
      };

      await User.create(newAdmin)
        .then((data) => {
          console.log(`------- Admin ajouté`);
          res.status(200).json({ message: "Admin ajouté" });
        })
        .catch((err) => {
          console.log(`------- Impossible d'ajouter un admin : ${err} `);
          res
            .status(500)
            .json({ message: "Impossible d'ajouter un admin : " + err });
        });
    }
  } catch (err) {
    res.status(500).json({
      message: "Impossible de vérifier la présence d'un admin : " + err,
    });
  }
};
