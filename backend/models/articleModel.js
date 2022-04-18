//https://github.com/GaziAdib/Node-Express-Sequelize-React-FullStack-image-upload

module.exports = (sequelize, DataTypes) => {
  const articleSchema = sequelize.define("articles", {
    id: {
      field: "article_id",
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nom: {
      field: "nom",
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      field: "description",
      allowNull: true,
    },
    isDisponible: {
      type: DataTypes.BOOLEAN,
      field: "is_disponible",
      defaultValue: true,
    },
    photo: {
      type: DataTypes.STRING,
      field: "photo",
      allowNull: false,
      defaultValue: "default.jpg",
    },
    prixUnitaire: {
      type: DataTypes.INTEGER,
      field: "prix_unitaire",
      allowNull: false,
    },
    categorie: {
      type: DataTypes.STRING,
      field: "categorie",
      defaultValue: "snack",
    },
  });

  return articleSchema;
};

//Tutos for
//One to many https://bezkoder.com/sequelize-associate-one-to-many/
//Many to many https://bezkoder.com/sequelize-associate-many-to-many/
