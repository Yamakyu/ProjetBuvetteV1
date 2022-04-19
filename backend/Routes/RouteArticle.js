const Express = require("express");
const router = Express.Router();
const userController = require("../controllers/userController");
const articleController = require("../controllers/articleController");
const imageMiddleware = require("../middleware/imageBuvetteMiddleware");

router.put(
  "/edit/:id",
  userController.isLoggedIn,
  imageMiddleware.single("file"),
  articleController.editArticle
);

router.post(
  "/add",
  userController.isLoggedIn,
  imageMiddleware.single("file"),
  articleController.addArticle
);

router.post("/category", articleController.findArticleByCategory);
router.post("/all", articleController.findAllArticles);
router.post("/search", articleController.findArticleByName);

router.get("/init", articleController.initSomeArticles);
router.get("/:id", articleController.findArticleById);

/*
router.post(
  "/add",
  userController.isLoggedIn, imageMiddleware.single("file"),
  articleController.addArticle
);
*/

module.exports = router;
