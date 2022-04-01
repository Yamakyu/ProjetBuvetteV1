const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/signup", userController.addUser);
router.get("/verify", userController.isLoggedIn);

module.exports = router;
