require("dotenv").config();

const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = db.users;
const Op = db.Sequelize.Op;

// ---------- POST ----------- (testé)
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
        message: "Non-authorisé, droits administrateurs requis",
      });
    } else {
      //On parse les booleens. Dans l'éventualité où le frontend envoie quelque chose qui n'est ni true, ni false, alors c'est false par défaut
      if (
        req.body.isAdmin != undefined &&
        typeof req.body.isAdmin != "boolean"
      ) {
        req.body.isAdmin = false;
      }
      if (
        req.body.isGerantBuvette != undefined &&
        typeof req.body.isGerantBuvette != "boolean"
      ) {
        req.body.isGerantBuvette = false;
      }
      if (
        req.body.isGerantMateriel != undefined &&
        typeof req.body.isGerantMateriel != "boolean"
      ) {
        req.body.isGerantMateriel = false;
      }

      //Deuxième parse pour obtenir directement un string avec les droits en clair. Le front en a besoin plusieurs fois
      if (req.body.isAdmin) {
        req.body.droits = "Admin";
      } else if (req.body.isGerantBuvette && req.body.isGerantMateriel) {
        req.body.droits = "Double gérant";
      } else if (req.body.isGerantBuvette) {
        req.body.droits = "Gerant Buvette";
      } else if (req.body.isGerantMateriel) {
        req.body.droits = "Gerant Matériel";
      } else {
        req.body.droits = "Aucun";
      }

      await User.create(req.body)
        .then((data) => {
          return res.status(200).json({
            message: "Inscription réussie",
            addedUser: data,
          });
        })
        .catch((err) => {
          displayThatError(res, err);
        });
    }
  } catch (err) {
    displayThatError(res, err);
  }
};

// ---------- POST ----------- (testé)
exports.addCustomer = async (req, res) => {
  console.log("USER controller : addCustomer -------");

  try {
    if (
      !req.thatRequestToken.isAdmin &&
      !req.thatRequestToken.isGerantBuvette
    ) {
      return res.status(401).json({
        message:
          "Non-authorisé, seul un gérant buvette ou un administrateur peut réaliser cette opération",
      });
    }

    req.body.isAdmin = false;
    req.body.isGerantBuvette = false;
    req.body.isGerantMateriel = false;
    req.body.droits = "aucun";
    req.body.password = "user";

    await User.create(req.body)
      .then((data) => {
        return res.status(200).json({
          message: "Inscription réussie",
          addedUser: data,
        });
      })
      .catch((err) => {
        displayThatError(res, err);
      });
  } catch (err) {
    displayThatError(res, err);
  }
};

//------------- POST -------------- (testé)
exports.login = async (req, res) => {
  console.log("USER controller : login -------");

  try {
    const userEmail = req.body.email;

    let thatUser = await User.findOne({ where: { email: userEmail } });

    //Si aucun utilisateur ne correspond
    if (!thatUser) {
      return res
        .status(500)
        .json({ message: "Combinaison login/password incorrecte (01)" });
    } else {
      let userMatch = await bcrypt.compare(
        req.body.password,
        thatUser.password
      );

      //Si le mot de passe n'est pas bon
      if (!userMatch) {
        return res
          .status(500)
          .json({ message: "Combinaison login/password incorrecte (02)" });
      } else {
        //Le front end n'a pas besoin du mdp (crypé ou pas), on ne le retourne donc pas. On retourne par contre les droits en string, pour que ce soit facile à lire.
        let userRightsToReturn;

        if (thatUser.isAdmin) {
          userRightsToReturn = "Admin";
        } else if (thatUser.isGerantBuvette && thatUser.isGerantMateriel) {
          userRightsToReturn = "Double gérant";
        } else if (thatUser.isGerantBuvette || thatUser.isGerantMateriel) {
          userRightsToReturn = thatUser.isGerantBuvette
            ? "Gerant Buvette"
            : "Gerant Matériel";
        } else {
          userRightsToReturn = "Aucun";
        }

        //Pour cela je créée un nouvel objet qui ne contient que les éléments utiles

        let userReturned = {
          id: thatUser.id,
          nom: thatUser.nom,
          prenom: thatUser.prenom,
          email: thatUser.email,
          droits: userRightsToReturn,
          isAdmin: thatUser.isAdmin,
          isGerantBuvette: thatUser.isGerantBuvette,
          isGerantMateriel: thatUser.isGerantMateriel,
        };

        //On ajoute les informations utilisateur ainsi que ses droits dans le token de connexion, pour pouvoir s'en re-servir plus tard dans d'autres API (next())
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

        return res.status(200).json({
          user: userReturned,
          message: `Connexion réussie. Bienvenue ${
            thatUser.nom != null ? thatUser.nom : ""
          } ${thatUser.prenom != null ? thatUser.prenom : ""}`,
          newToken,
        });
      }
    }
  } catch (err) {
    displayThatError(res, err);
  }
};

// ---------- PUT ----------- (testé)
exports.editUser = async (req, res) => {
  console.log("USER controller : editUser -------");

  try {
    const userToUpdateID = req.params.id;

    if (!req.thatRequestToken.isAdmin) {
      return res.status(401).json({
        message: "Non-authorisé, droits administrateurs requis",
      });
    }

    if (req.body.id !== undefined) {
      return res.status(401).json({
        message: "Non-authorisé ! Le changement d'identifiant est interdit.",
      });
    }

    await User.update(req.body, {
      where: { id: userToUpdateID },
    })
      .then((num) => {
        //En réponse de la requête d'update, Sequelize retourne le nombre d'entrées modifiées
        if (num > 0) {
          console.log(
            "----- user has been updated. Returning data.... -------"
          );
        } else {
          return res.status(500).json({
            message: `Impossible de modifier l'utilisateur dont l'id est ${userToUpdateID}.`,
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message: `Error updating user with id=${userToUpdateID} : + ${err}`,
          error: err,
        });
      });

    let thatUserUpdated = await User.findByPk(userToUpdateID);

    if (thatUserUpdated == null) {
      return res.status(404).json({
        message: `Impossible de retourner l'utilisateur modifié dont l'id est l'id=${userToUpdateID}.`,
      });
    } else {
      return res.status(200).json({
        message: "Utilisateur modifié avec succès.",
        updatedUser: thatUserUpdated,
      });
    }
  } catch (err) {
    displayThatError(res, err);
  }
};

//------------- GET -------------- (tested) (not used as is)
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
      console.log("---------- IS LOGGED IN : token expiré");
      return res
        .status(440) //← 440 = session expired
        .json({
          message:
            "Accès refusé, session expirée, veuillez vous reconnecter. " +
            error,
          needLogout: true,
        });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log("---------- IS LOGGED IN : token invalide");
      return res
        .status(401) //← 401 = unauthorized
        .json({
          message:
            "Accès refusé, token invalide, cette opération requiert une élévation, veuillez solliciter un administrateur. " +
            error,
          needLogout: true,
        });
    } else if (error instanceof TypeError) {
      return res
        .status(400) //← 400 = bad request
        .json({
          message: "Aucun token. Veuillez vous connecter. " + error,
          needLogout: true,
        });
    } else {
      displayThatError(res, error);
    }
  }
};

//------------- GET -------------- (tested) (not used as is)
exports.checkAdmins = async (req, res) => {
  console.log("USER controller : checkAdmins -------");

  try {
    let adminsFound = await User.findAll({ where: { isAdmin: true } });

    let adminCount = 0;
    adminsFound.forEach((admin) => {
      adminCount++;
    });

    if (adminCount > 0) {
      return res.status(200).json({
        message: "Compte admin prêt",
      });
    } else {
      let admin1 = {
        nom: "Mayaki",
        prenom: "Abdoul-Jabar",
        email: "contact@bsolife.fr",
        password: "root",
        isAdmin: true,
      };

      let admin2 = {
        nom: "AdminNom",
        prenom: "AdminPrenom",
        email: "admin@admin.fr",
        password: "root",
        isAdmin: true,
      };

      await User.create(admin1)
        .then((data) => {
          console.log(`------- Admin 1 ajouté`);
        })
        .catch((err) => {
          console.log(`------- Impossible d'ajouter un admin : ${err} `);
          return res
            .status(500)
            .json({ message: "Impossible d'ajouter un admin : " + err });
        });

      await User.create(admin2)
        .then((data) => {
          console.log(`------- Admin 2 ajouté`);
          return res.status(200).json({ message: "Admin ajouté" });
        })
        .catch((err) => {
          console.log(`------- Impossible d'ajouter un admin : ${err} `);
          return res
            .status(500)
            .json({ message: "Impossible d'ajouter un admin : " + err });
        });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Impossible de vérifier la présence d'un admin : " + err,
    });
  }
};

//Aide pour eager loading https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/

//------------- GET -------------- (testé)
exports.findById = async (req, res) => {
  console.log("USER controller : findById -------");

  try {
    let thatUser;
    const id = req.params.id;

    thatUser = await User.findByPk(id);

    console.log(thatUser);

    if (thatUser == null) {
      return res.status(200).send({
        message: `Aucun utilisateur trouvé avec l'id=${id}.`,
      });
    }

    if (
      thatUser.isActiveAccount ||
      (!thatUser.isActiveAccount && req.thatRequestToken.isAdmin)
    ) {
      return res.status(200).json({
        message: "Utilisateur trouvé :",
        resultat: thatUser,
      });
    } else {
      return res.status(200).json({
        message: `Aucun utilisateur trouvé avec l'id ${id}`,
      });
    }
  } catch (err) {
    displayThatError(res, err);
  }
};

//------------- GET -------------- (testé)
exports.findByRole = async (req, res) => {
  console.log("USER controller : findByRole -------");

  try {
    let theseUsers;
    let searchFilter = req.body.filter;

    let { isInactiveAccountsDisplayed, isTtryingForbiddenRequest } =
      checkAuthorizationDeadAccounts(req);

    if (isInactiveAccountsDisplayed) {
      switch (searchFilter) {
        case "Admin":
          console.log("------ returning all ADMINS");
          theseUsers = await User.findAll({
            where: { isAdmin: true },
          });
          break;
        case "Gerant Buvette":
          console.log("------ returning all GERANTS BUVETTE");
          theseUsers = await User.findAll({
            where: {
              [Op.or]: [{ isGerantBuvette: true }, { isAdmin: true }],
            },
          });
          break;
        case "Gerant Matériel":
          console.log("------ returning all GERANTS MATERIEL");
          theseUsers = await User.findAll({
            where: {
              [Op.and]: [{ isGerantMateriel: true, isAdmin: true }],
            },
          });
          break;
        /*
        case "not Buvette":
          console.log("------ returning all NON GERANTS BUVETTE");
          theseUsers = await User.findAll({
            where: {
              [Op.and]: [
                {
                  isGerantBuvette: false,
                  isAdmin: false,
                },
              ],
            },
          });
          break;
        case "not Matériel":
          console.log("------ returning all GERANTS MATERIEL");
          theseUsers = await User.findAll({
            where: {
              [Op.and]: [
                {
                  isGerantMateriel: false,
                  isAdmin: false,
                },
              ],
            },
          });
          break;
          */
        case "Double gérant":
          console.log("------ returning all GERANTS DOUBLE");
          theseUsers = await User.findAll({
            here: {
              [Op.or]: [
                {
                  [Op.and]: [{ isGerantBuvette: true, isGerantMateriel: true }],
                },
                { isAdmin: true, isActiveAccount: true },
              ],
            },
          });
          break;
        case "Aucun":
          console.log("------ returning all users WITHOUT ROLES");
          theseUsers = await User.findAll({
            where: {
              [Op.and]: [
                {
                  isGerantMateriel: false,
                  isGerantBuvette: false,
                  isAdmin: false,
                },
              ],
            },
          });
          break;
        default:
          //Dans le cas où le filtre proposé est invalide
          console.log("------ no matching filter");
          return res.status(200).json({
            message:
              "Aucun résultat pour le critère de filtrage choisi. Veuillez modifier votre recherche.",
          });
      }
    } else {
      console.log(
        " --------------- NOT RETURNING INACTIVE ACCOUNTS ----------------------"
      );

      switch (searchFilter) {
        case "Admin":
          console.log("------ returning all ADMINS");
          theseUsers = await User.findAll({
            where: {
              [Op.and]: [{ isActiveAccount: true, isAdmin: true }],
            },
          });
          break;
        case "Gerant Buvette":
          console.log("------ returning all GERANTS BUVETTE");
          theseUsers = await User.findAll({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [{ isGerantBuvette: true, isActiveAccount: true }],
                },
                {
                  [Op.and]: [{ isAdmin: true, isActiveAccount: true }],
                },
              ],
            },
          });
          break;
        case "Gerant Matériel":
          console.log("------ returning all GERANTS MATERIEL");
          theseUsers = await User.findAll({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [{ isGerantMateriel: true, isActiveAccount: true }],
                },
                {
                  [Op.and]: [{ isAdmin: true, isActiveAccount: true }],
                },
              ],
            },
          });
          break;

        /*
        case "not Buvette":
          console.log("------ returning all NON GERANTS BUVETTE");
          theseUsers = await User.findAll({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [{ isGerantBuvette: false, isActiveAccount: true }],
                },
                {
                  [Op.and]: [{ isAdmin: false, isActiveAccount: true }],
                },
              ],
            },
          });
          break;
        case "not Matériel":
          console.log("------ returning all GERANTS MATERIEL");
          theseUsers = await User.findAll({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    { isGerantMateriel: false, isActiveAccount: true },
                  ],
                },
                {
                  [Op.and]: [{ isAdmin: false, isActiveAccount: true }],
                },
              ],
            },
          });
          break;
          */

        case "Double gérant":
          console.log("------ returning all GERANTS DOUBLE");
          theseUsers = await User.findAll({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    {
                      isGerantBuvette: true,
                      isGerantMateriel: true,
                      isActiveAccount: true,
                    },
                  ],
                },
                {
                  [Op.and]: [{ isAdmin: true, isActiveAccount: true }],
                },
              ],
            },
          });
          break;
        case "Aucun":
          console.log("------ returning all users WITHOUT ROLES");
          theseUsers = await User.findAll({
            where: {
              [Op.and]: [
                { isGerantMateriel: false },
                { isGerantBuvette: false },
                { isAdmin: false },
                { isActiveAccount: true },
              ],
            },
          });
          // theseUsers = await User.findAll({
          //   where: { isGerantMateriel: false },
          //   [Op.and]: [{ isGerantBuvette: false }],
          //   [Op.and]: [{ isAdmin: false }],
          //   [Op.and]: [{ isActiveAccount: true }],
          // });
          break;
        default:
          //Dans le cas où le filtre proposé est invalide
          console.log("------ no matching filter");
          return res.status(200).json({
            message:
              "Aucun résultat pour le critère de filtrage choisi. Veuillez modifier votre recherche.",
          });
      }
    }

    displayResults(
      res,
      theseUsers,
      isTtryingForbiddenRequest,
      req.thatRequestToken.id
    );
  } catch (error) {
    displayThatError(res, error);
  }
};

//------------- GET -------------- (testé)
exports.findByName = async (req, res) => {
  console.log("USER controller : findByName -------");

  try {
    let enteredName = req.query.name;
    let theseUsers;

    let { isInactiveAccountsDisplayed, isTtryingForbiddenRequest } =
      checkAuthorizationDeadAccounts(req);

    //https://stackoverflow.com/questions/51370932/sequelize-op-contains-throws-unhandled-rejection-error-invalid-value
    //Inspiration pour les requêtes OR et AND ↑

    if (isInactiveAccountsDisplayed) {
      theseUsers = await User.findAll({
        where: {
          [Op.or]: [
            { nom: { [Op.like]: `%${enteredName}%` } },
            { prenom: { [Op.like]: `%${enteredName}%` } },
          ],
        },
      });
    } else {
      theseUsers = await User.findAll({
        where: {
          [Op.or]: [
            { nom: { [Op.like]: `%${enteredName}%` } },
            { prenom: { [Op.like]: `%${enteredName}%` } },
          ],
          [Op.and]: [{ isActiveAccount: true }],
        },
      });
    }
    displayResults(
      res,
      theseUsers,
      isTtryingForbiddenRequest,
      req.thatRequestToken.id
    );
  } catch (error) {
    displayThatError(res, error);
  }
};

//------------- GET -------------- (testé)
exports.findAll = async (req, res) => {
  console.log("USER controller : findAll -------");

  try {
    let theseUsers;

    let { isInactiveAccountsDisplayed, isTtryingForbiddenRequest } =
      checkAuthorizationDeadAccounts(req);

    if (isInactiveAccountsDisplayed) {
      theseUsers = await User.findAll();
    } else {
      theseUsers = await User.findAll({ where: { isActiveAccount: true } });
    }

    displayResults(
      res,
      theseUsers,
      isTtryingForbiddenRequest,
      req.thatRequestToken.id
    );
  } catch (err) {
    displayThatError(res, err);
  }
};

//-----------------------------------------
//--------------FUNCTIONS------------------
//-----------------------------------------
let displayResults = (
  requestResponse,
  resultArray,
  triedForbiddenRequest,
  userId
) => {
  resultArray = resultArray.filter(
    (userToRemove) => userToRemove.id !== userId
  );
  //↑ Dans l'éventualité où les résultats incluent le compte qui a fait la requête, on l'enlève

  if (resultArray.length === 0) {
    return requestResponse.status(200).json({
      message: "Aucun résultat",
    });
  } else if (resultArray.length > 0 && triedForbiddenRequest) {
    return requestResponse.status(200).json({
      warning:
        "Droits administrateurs requis pour afficher les utilisateurs désactivés/supprimés.",
      message: "Résultats de la recherche : ",
      resultArray,
    });
  } else {
    return requestResponse.status(200).json({
      message: "Résultats de la recherche : ",
      resultArray,
    });
  }
};

let displayThatError = (requestResponse, thatError) => {
  console.log("↓ ------- Une erreur s'est produite ↓");
  console.log(thatError);
  return requestResponse.status(500).json({
    message: `Une erreur s'est produite lors de la requête : ${thatError}. Pour plus de détails, consultez la console.`,
    error: thatError,
  });
};

//Retourne si oui ou non on demande l'affichage des comptes désactivés, et si oui ou non on y est autorisé (admin)
let checkAuthorizationDeadAccounts = (thatRequest) => {
  let isInactiveAccountsDisplayed =
    thatRequest.body.isInactiveAccountsIncluded &&
    thatRequest.thatRequestToken.isAdmin;

  let isTtryingForbiddenRequest =
    thatRequest.body.isInactiveAccountsIncluded &&
    !thatRequest.thatRequestToken.isAdmin;

  return { isInactiveAccountsDisplayed, isTtryingForbiddenRequest };
};
