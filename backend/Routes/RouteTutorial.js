const express = require("express");
const router = express.Router();

const tutorialController = require("../controllers/tutorialController");

router.post("/", tutorialController.create);

router.get("/", tutorialController.findAll);
router.get("/published", tutorialController.findAllPublished);
router.get("/search", tutorialController.findByTitle);
router.get("/:id", tutorialController.findById);
//Pour faire une query avec titre on met un "?maVariable=maValeur"
//Par exemple, pour chercher les tutos dont le titre qui contiennent "tuto" : http://localhost:8080/api/tutorials/search?title=tuto
router.put("/:id", tutorialController.update);
router.delete("/deleteAll", tutorialController.deleteAll);
router.delete("/:id", tutorialController.deleteById);

module.exports = router;
