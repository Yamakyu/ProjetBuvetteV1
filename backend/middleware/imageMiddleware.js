const multer = require("multer");
const path = require("path");

/*
// Liste des types MIME https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const imageFilter = (req, file, myCallback) => {
  if (file.mimetype.startsWith("image")) {
    myCallback(null, true);
  } else {
    myCallback("L'élément uploadé n'est pas une image", false);
  }
};

var myStorage = multer.diskStorage({
  destination: (req, file, myCallback) => {
    myCallback(null, __basedir + "/resources/static/assets/uploads");
  },
  filename: (req, file, myCallback) => {
    myCallback(null, `${Date.now()}-BSOLIFE-${file.originalname}`);
  },
});

//On va exporter ceci qui contient le nécessaire pour vérifier qu'un fichier est une image, et l'emplacement de stockage, tout deux définis dans myStorage et imageFilter
var uploadFile = multer({
  storage: myStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: "20000000", //← 20Mo
  },
});
*/

//------------------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./publicImagesBis");
    //cb(null, "./publicImages");
    //cb(null, "./resources/static/assets/uploads");
    //cb(null, __basedir + "/resources/static/assets/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-BSOLIFE-${file.originalname}`);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: "10000000" }, //← 10Mo
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
});

module.exports = uploadFile;
