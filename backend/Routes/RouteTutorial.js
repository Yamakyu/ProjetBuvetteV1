const express = require("express");
const router = express.Router();

const tutorialController = require("../controllers/tutorialController");

router.post("/", tutorialController.create);

module.exports = router;
