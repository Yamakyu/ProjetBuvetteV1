require("dotenv").config();
const db = require("../models");
const Article = db.articles;
const fs = require("fs");
const os = require("os");

// main work

//POST ---------- PING

exports.ping = async (req, res) => {
  try {
    console.log("that worked apparently");
    return res.status(200).json({
      message: "Pinged",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      message: "couldn't ping",
    });
  }
};

exports.upload = async (req, res) => {
  try {
    /*
    if (req.file) {
      console.log(req.file);
      return res.status(200).json({
        message: "image found",
      });
    }
    */

    let info = {
      photo: req.file.filename,
      //photo: req.file.path,
      //photo: fs.readFileSync(req.file.path),
      //photo: fs.readFileSync(req.file.path).buffer.toString("base64"),
      nom: req.body.title,
      prixUnitaire: req.body.price,
      description: req.body.description,
      isDisponible: req.body.published,
    };

    const article = await Article.create(info);

    res.status(200).json({
      message: "that worked, apparently",
      image: info.photo,
    });

    console.log(article);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      message: "couldn't upload",
    });
  }
};

exports.getThatArticle = async (req, res) => {
  try {
    let thatId = req.params.id;

    const networkInterfaces = os.networkInterfaces();
    const ip = networkInterfaces["Wi-Fi"][1]["address"];

    await Article.findByPk(thatId)
      .then((article) => {
        res.status(200).json({
          message: "success",
          article,
          ip: `${ip}:${process.env.PORT}`,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Erreur en récupérant l'article",
          error,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      message: "couldn't retrieve",
    });
  }
};

exports.getIp = async (req, res) => {
  try {
    const networkInterfaces = os.networkInterfaces();
    const ip = networkInterfaces["Wi-Fi"][1]["address"];
    //const ip = networkInterfaces["eth0"][0]["address"];    eth0 ??
    res.status(200).json({
      networkInterfaces,
      ip,
    });
  } catch (error) {
    console.log("Impossible d'obtenir l'IP");
    console.log(error);
    res.status(500).json({
      message: "Impossibe d'avoir l'IP",
      error,
    });
  }
};
