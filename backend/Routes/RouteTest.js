const Express = require("express");
const router = Express.Router();
const userController = require("../controllers/userController");
const testController = require("../controllers/testController");
const imageMiddleware = require("../middleware/imageMiddleware");

router.post(
  "/ping",
  userController.isLoggedIn,
  imageMiddleware.single("file"),
  testController.ping
);
router.post(
  "/upload",
  userController.isLoggedIn,
  imageMiddleware.single("file"),
  testController.upload
);

router.get(
  "/article/:id",
  userController.isLoggedIn,
  testController.getThatArticle
);

module.exports = router;
