const Express = require("express");
const router = Express.Router();
const userController = require("../controllers/userController");
const invoiceController = require("../controllers/invoiceController");

//router.put("/edit/:id", userController.isLoggedIn, imageMiddleware.single("file"), articleController.editArticle);

router.post("/add", userController.isLoggedIn, invoiceController.addInvoice);

//router.post("/category", articleController.findArticleByCategory);
//router.post("/all", articleController.findAllArticles);
//router.post("/search", articleController.findArticleByName);

//router.get("/ip", articleController.getNetworkInfo);
//router.get("/init", articleController.initSomeArticles);
//router.get("/:id", articleController.findArticleById);

module.exports = router;
