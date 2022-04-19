require("dotenv").config();
const db = require("../models");
const Article = db.articles;
const Op = db.Sequelize.Op;
const os = require("os");

const networkInterfaces = os.networkInterfaces();
const ip = networkInterfaces["Wi-Fi"][1]["address"];

//ENVISAGER SÉRIEUSEMENT de n'utiliser qu'un controleur pour la buvette et le stock.
//HECK. Ca peut être le même model (il faudra une table différente, cela dit)
//Plus tard, pas maintenant.

// ---------- GET ----------- (testé)
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
        photo: "default/Awoken_Yamakyu.png",
        prixUnitaire: 20,
      };

      let newArticle2 = {
        nom: "Current mood",
        prixUnitaire: 10,
        photo: "default/Hifumi_but_NOT_FINE.jpg",
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

// ---------- POST ----------- (testé sans nouvelle image)
exports.addArticle = async (req, res) => {
  console.log("ARTICLE controller : addArticle -------");
  try {
    if (
      !req.thatRequestToken.isAdmin &&
      !req.thatRequestToken.isGerantBuvette
    ) {
      return res.status(401).json({
        message: "Vous n'êtes pas authorisés à effectuer cette action",
      });
    }

    let isPhotoAttached = req.file ? true : false;

    let articleInfo = {
      nom: req.body.nom,
      description: req.body.description,
      photo: isPhotoAttached ? `picsBuvette/${req.file.filename}` : undefined,
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

// ---------- GET ----------- (testé)
exports.findArticleById = async (req, res) => {
  console.log("ARTICLE controller : getArticleById -------");

  try {
    let articleID = req.params.id;
    await Article.findByPk(articleID)
      .then((thatArticle) => {
        return res.status(200).json({
          article: {
            ...thatArticle.dataValues,
            photo: `http://${ip}:${process.env.PORT}/images/${thatArticle.dataValues.photo}`,
          },
        });
      })
      .catch((error) => displayThatError(res, error));
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- POST ----------- (testé)
exports.findArticleByName = async (req, res) => {
  console.log("ARTICLE controller : findArticleByName -------");

  try {
    let enteredName = req.query.name;
    let theseArticles;

    //Si on fait une recherche en mettant le paramitre isOnlyAvailableArticles à true, on retourne EXCLUSIVEMENT les articles disponibles. Si on veut EXCLUSIVEMENT les articles non disponible, on met à false. Pour obtenir tout les articles, on mets à null ou undefined.
    if (req.body.isOnlyAvailableArticles) {
      theseArticles = await Article.findAll({
        where: {
          [Op.and]: [
            { nom: { [Op.like]: `%${enteredName}%` } },
            { isDisponible: true },
          ],
        },
      });
    } else if (
      req.body.isOnlyAvailableArticles === null ||
      req.body.isOnlyAvailableArticles === undefined
    ) {
      theseArticles = await Article.findAll({
        where: { nom: { [Op.like]: `%${enteredName}%` } },
      });
    } else {
      theseArticles = await Article.findAll({
        where: {
          [Op.and]: [
            { nom: { [Op.like]: `%${enteredName}%` } },
            { isDisponible: false },
          ],
        },
      });
    }
    displayResults(res, theseArticles);
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- POST ----------- (testé)
exports.findArticleByCategory = async (req, res) => {
  console.log("ARTICLE controller : findArticleByCategory -------");

  try {
    let theseArticles;
    let searchFilter = req.body.filter;

    if (req.body.isOnlyAvailableArticles) {
      theseArticles = await Article.findAll({
        where: {
          [Op.and]: [{ categorie: searchFilter }, { isDisponible: true }],
        },
      });
    } else if (
      req.body.isOnlyAvailableArticles === null ||
      req.body.isOnlyAvailableArticles === undefined
    ) {
      console.log(req.body.isOnlyAvailableArticles);
      theseArticles = await Article.findAll({
        where: { categorie: searchFilter },
      });
    } else {
      theseArticles = await Article.findAll({
        where: {
          [Op.and]: [{ categorie: searchFilter }, { isDisponible: false }],
        },
      });
    }

    displayResults(res, theseArticles);
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- POST ----------- (testé)
exports.findAllArticles = async (req, res) => {
  console.log("ARTICLE controller : findAllArticles -------");

  try {
    let theseArticles;

    if (req.body.isOnlyAvailableArticles) {
      theseArticles = await Article.findAll({
        where: { isDisponible: true },
      });
    } else if (
      req.body.isOnlyAvailableArticles === null ||
      req.body.isOnlyAvailableArticles === undefined
    ) {
      theseArticles = await Article.findAll();
    } else {
      theseArticles = await Article.findAll({
        where: { isDisponible: false },
      });
    }

    displayResults(res, theseArticles);
  } catch (err) {
    displayThatError(res, err);
  }
};

// ---------- PUT ----------- (testé (pas nouvelle image))
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
    let fixedResultArray = []; //Fixed, car avec le bon lien de photo

    resultArray.forEach((article) => {
      article = {
        ...article.dataValues,
        photo: `http://${ip}:${process.env.PORT}/images/${article.dataValues.photo}`,
      };
      fixedResultArray.push(article);
    });

    return requestResponse.status(200).json({
      message: "Résultats de la recherche : ",
      resultArray: fixedResultArray,
    });
  }
};

//↑ REQUIERT UNE UPDATE POUR AFFICHER DES ARRAYS D'IMAGES.

let displayThatError = (requestResponse, thatError) => {
  console.log("↓ ------- Une erreur s'est produite ↓");
  console.log(thatError);
  return requestResponse.status(500).json({
    message: `Une erreur s'est produite lors de la requête : ${thatError}. Pour plus de détails, consultez la console.`,
    error: thatError,
  });
};
