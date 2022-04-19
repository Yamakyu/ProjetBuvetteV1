const Express = require("express");
const router = Express.Router();
const userController = require("../controllers/userController");
const articleController = require("../controllers/articleController");
const imageMiddleware = require("../middleware/imageMiddleware");

//router.get("/init", art)

/*
router.post(
  "/ping",
  userController.isLoggedIn,
  imageMiddleware.single("file"),
  articleController.ping
);
router.post(
  "/upload",
  userController.isLoggedIn,
  imageMiddleware.single("file"),
  articleController.upload
);

router.get(
  "/article/:id",
  userController.isLoggedIn,
  articleController.getThatArticle
);
*/

module.exports = router;
