const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/signup", userController.isLoggedIn, userController.addUser);
router.post(
  "/signup/customer",
  userController.isLoggedIn,
  userController.addCustomer
);

router.put("/edit/:id", userController.isLoggedIn, userController.editUser);

router.post(
  "/search/role",
  userController.isLoggedIn,
  userController.findByRole
);
router.post("/search/all", userController.isLoggedIn, userController.findAll);
router.post(
  "/search/name",
  userController.isLoggedIn,
  userController.findByName
);
router.post(
  "/search/mail",
  userController.isLoggedIn,
  userController.findByMail
);
router.post("/search/:id", userController.isLoggedIn, userController.findById);
//Pour faire une query avec une recherche on met un "?maVariable=maValeur"
//Par exemple, pour chercher les utilisateurs dont le nom contient "john" : http://localhost:8080/api/users/search?name=john

//router.get("/verify", userController.isLoggedIn);
module.exports = router;
