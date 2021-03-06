const Express = require("express");
const router = Express.Router();
const userController = require("../controllers/userController");
const testController = require("../controllers/testController");
const imageMiddleware = require("../middleware/imageBuvetteMiddleware");

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

router.post(
  "/uploadax",
  userController.isLoggedIn,
  imageMiddleware.single("file"),
  testController.uploadAxios
);

router.get(
  "/article/:id",
  userController.isLoggedIn,
  testController.getThatArticle
);

router.get("/ip", testController.getIp);

module.exports = router;
