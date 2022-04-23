const Express = require("express");
const router = Express.Router();
const userController = require("../controllers/userController");
const invoiceController = require("../controllers/invoiceController");

//router.put("/edit/:id", userController.isLoggedIn, imageMiddleware.single("file"), articleController.editArticle);

router.post("/add", userController.isLoggedIn, invoiceController.addInvoice);

router.get(
  "/details/:id",
  userController.isLoggedIn,
  invoiceController.findInvoiceDetailsByInvoiceID
);
router.get(
  "/customer/:id",
  userController.isLoggedIn,
  invoiceController.findInvoiceByCustomerID
);
router.get(
  "/gerant/:id",
  userController.isLoggedIn,
  invoiceController.findInvoiceByGerantID
);
router.get(
  "/all",
  userController.isLoggedIn,
  invoiceController.findAllInvoices
);

router.get(
  "/:id",
  userController.isLoggedIn,
  invoiceController.findInvoiceByID
);

router.put(
  "/edit/:id",
  userController.isLoggedIn,
  invoiceController.editInvoice
);

module.exports = router;
