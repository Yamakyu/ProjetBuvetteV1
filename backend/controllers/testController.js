require("dotenv").config();
const db = require("../models");
const Article = db.articles;
const os = require("os");
const https = require("node:https");
const fs = require("fs");
const axios = require("axios");
const formData = require("form-data");

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

exports.uploadAxios = async (req, res) => {
  try {
    console.log("ping !");

    const myFile = fs.readFileSync(
      `./images/picsBuvette/${req.file.filename}`,
      {
        encoding: "base64",
      }
    );

    const myForm = new formData();
    myForm.append("image", myFile);

    await axios
      .post(
        `https://api.imgbb.com/1/upload?key=37711df21236d0496b6a91c8a3ba843f`,
        myForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("API response ↓");
        console.log(response);
        console.log(response.data.data.url);

        const image = response.data.data.url;

        return res.status(200).json({
          image,
          message: "that worked !",
        });
      })
      .catch((err) => {
        console.log("API error ↓");
        console.log(err);
        if (err.response.data.error) {
          console.log(err.response.data.error);
        }
        return res.status(500).json({
          err,
          dataError: err.response.data.error,
          message: "Didn't work, but request was sent",
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      message: "Didn't work",
    });
  }
};

exports.upload = async (req, res) => {
  try {
    const myFile = fs.createReadStream(
      `images/picsBuvette/${req.file.filename}`
    );

    const options = {
      hostname: "freeimage.host",
      path: "/api/1/upload/?key=6d207e02198a847aa98d0a2a901485a5",
      port: 443,
      method: "POST",
      headers: {
        //"Content-Type": "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const request = https.request(options, (response) => {
      console.log("statusCode:", response.statusCode);
      console.log("headers:", response.headers);

      response.setEncoding("utf8");

      request.on("error", (e) => {
        console.error(e);
        return res.status(500).json({
          message: `Ca marche pas : ${error}`,
          error,
        });
      });

      myFile.on("data", function (data) {
        request.write(data);
        console.log(data);
      });

      response.on("data", (chunk) => {
        console.log(`BODY: ${chunk}`);
      });

      response.on("end", () => {
        console.log("No more data in response.");
      });
    });

    myFile.on("end", function () {
      request.end();
    });

    //request.write(myFile);
    //request.end();

    /*
    const options = {
      hostname: "thronesapi.com",
      path: "/api/v2/Characters/5",
      port: 443,
      method: "GET",
    };

    const request = https.request(options, (response) => {
      console.log("statusCode:", response.statusCode);
      console.log("headers:", response.headers);

      response.on("data", (d) => {
        console.log(d);
        process.stdout.write(d);
      });
    });

    request.on("error", (e) => {
      console.error(e);

      return res.status(500).json({
        message: `Ca marche pas : ${error}`,
        error,
      });
    });
    request.write(data);
    request.end();
    */

    //--------

    /*
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
    */
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
