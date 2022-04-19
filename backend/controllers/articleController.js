require("dotenv").config();
const db = require("../models");
const Article = db.articles;
const os = require("os");

//ENVISAGER SÉRIEUSEMENT de n'utiliser qu'un controleur pour la buvette et le stock.
//HECK. Ca peut être le même model (il faudra une table différente, cela dit)
//Plus tard, pas maintenant.

// ---------- GET ----------- ()
exports.initSomeArticles = async (req, res) => {
  console.log("ARTICLE controller : initSomeArticles -------");

  try {
    let articlesFound = await Article.findAll();

    let articleCount = 0;
    articlesFound.forEach((article) => {
      articleCount++;
    });

    if (articleCount > 0) {
      return res.status(200).json({
        message: "Il y a déjà des articles.",
      });
    } else {
      let newArticle1 = {
        nom: "Awoken Yamakyu",
        description: "100% potato, 200% awoken",
        isDisponible: true,
        photo: "Awoken_Yamakyu.png",
        prixUnitaire: 20,
      };

      let newArticle2 = {
        nom: "Current mood",
        prixUnitaire: 10,
        photo: "Hifumi_but_NOT_FINE.jpg",
      };

      let newArticle3 = {
        nom: "Le néant",
        description: "No thoughts, head empty",
        prixUnitaire: 0,
        isDisponible: false,
      };

      await Article.bulkCreate([newArticle1, newArticle2, newArticle3])
        .then((data) => {
          console.log(`------- Articles ajoutés`);
          return res.status(200).json({ message: "3 articles ajoutés" });
        })
        .catch((error) => displayThatError(res, error));
    }
  } catch (error) {
    displayThatError;
  }
};

// ---------- POST ----------- ()
exports.addArticle = async (req, res) => {
  console.log("ARTICLE controller : addArticle -------");
  try {
    if (
      !req.thatRequestToken.isAdmin ||
      !req.thatRequestToken.isGerantBuvette
    ) {
      return res.status(401).json({
        message: "Vous n'êtes pas authorisés à effectuer cette action",
      });
    }

    let articleInfo = {
      nom: req.body.nom,
      description: req.body.description,
      photo: req.file.filename,
      prixUnitaire: req.body.price,
      isDisponible: req.body.published,
      categorie: req.body.categorie,
    };

    await Article.create(articleInfo)
      .then((thatArticle) => {
        return res.status(200).json({
          message: `${thatArticle.nom} ajouté avec succès !`,
          article: thatArticle,
        });
      })
      .catch((err) => displayThatError(res, err));
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- GET ----------- ()
exports.getArticleById = async (req, res) => {
  console.log("ARTICLE controller : getArticleById -------");

  try {
    let articleID = req.params.id;

    const networkInterfaces = os.networkInterfaces();
    const ip = networkInterfaces["Wi-Fi"][1]["address"];

    await Article.findByPk(articleID)
      .then((thatArticle) => {
        res.status(200).json({
          message: "success",
          article: {
            ...thatArticle,
            photo: `http://${ip}:${process.env.PORT}/images/${thatArticle.photo}`,
          },
        });
      })
      .catch((error) => displayThatError(res, error));
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- GET ----------- ()
exports.findArticleByName = async (req, res) => {
  console.log("ARTICLE controller : findArticleByName -------");

  try {
    let enteredName = req.query.name;
    let theseArticles;

    if (req.body.isOnlyFetchingAvailableArticles) {
      theseArticles = await Article.findAll({
        where: {
          [Op.and]: [
            { nom: { [Op.like]: `%${enteredName}%` } },
            { isDisponible: true },
          ],
        },
      });
    } else {
      theseArticles = await Article.findAll({
        where: { nom: { [Op.like]: `%${enteredName}%` } },
      });
    }
    displayResults(res, theseArticles);
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- GET ----------- ()
exports.findArticleByCategory = async (req, res) => {
  console.log("ARTICLE controller : findArticleByCategory -------");

  try {
    let theseArticles;
    let searchFilter = req.body.filter;

    if (req.body.isOnlyFetchingAvailableArticles) {
      theseArticles = await Article.findAll({
        where: {
          [Op.and]: [{ categorie: searchFilter }, { isDisponible: true }],
        },
      });
    } else {
      theseArticles = await Article.findAll({
        where: { categorie: searchFilter },
      });
    }

    displayResults(res, theseArticles);
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- GET ----------- ()
exports.findAllArticles = async (req, res) => {
  console.log("ARTICLE controller : findAllArticles -------");

  try {
    let theseArticles;

    if (req.body.isOnlyFetchingAvailableArticles) {
      theseArticles = await Article.findAll({
        where: { isDisponible: true },
      });
    } else {
      theseArticles = await Article.findAll();
    }

    displayResults(res, theseArticles);
  } catch (err) {
    displayThatError(res, err);
  }
};

// ---------- PUT ----------- ()
exports.editArticle = async (req, res) => {
  console.log("ARTICLE controller : editArticle -------");

  try {
    const articleToUpdateID = req.params.id;

    await Article.update(req.body, {
      where: { id: articleToUpdateID },
    })
      .then((num) => {
        if (num > 0) {
          console.log(
            "----- Article modifié. En attente de le récupérer.... -------"
          );
        } else {
          return res.status(500).json({
            message: `Impossible de modifier l'article dont l'id est ${articleToUpdateID}.`,
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Erreur en modifiant l'article id=${articleToUpdateID} : + ${error}`,
          error,
        });
      });

    let thatArticleUpdated = await Article.findByPk(articleToUpdateID);

    if (thatArticleUpdated === null || thatArticleUpdated === undefined) {
      return res.status(404).json({
        message: `Impossible de retourner l'article modifié dont l'id est l'id=${articleToUpdateID}.`,
      });
    } else {
      return res.status(200).json({
        message: "Article modifié avec succès.",
        updatedArticle: thatArticleUpdated,
      });
    }
  } catch (err) {
    displayThatError(res, err);
  }
};

//-----------------------------------------
//--------------FUNCTIONS------------------
//-----------------------------------------
let displayResults = (requestResponse, resultArray) => {
  if (resultArray.length === 0) {
    return requestResponse.status(200).json({
      message: "Aucun résultat",
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
