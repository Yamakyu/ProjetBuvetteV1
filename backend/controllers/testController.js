require("dotenv").config();
const db = require("../models");
const Article = db.articles;
const os = require("os");
const fetch = import("node-fetch");

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
    await fetch("https://freeimage.host/api/1/upload", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        nom: "yamakyu",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API response ↓");
        console.log(data.message);
      });
  } catch (error) {
    console.log("↓ ------- Une erreur s'est produite ↓");
    console.log(error);
    return res.status(500).json({
      message: `Ca marche pas : ${error}`,
      error,
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
