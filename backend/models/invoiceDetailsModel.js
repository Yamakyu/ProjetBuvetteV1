module.exports = (sequelize, DataTypes) => {
  const invoiceLine = sequelize.define("invoiceLines", {
    id: {
      field: "invoice_details_id",
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    invoiceId: {
      //FK
      //ID de la facture associée à cette ligne
      field: "invoice_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customerId: {
      //FK
      //ID (utilisateur) de la personne associée à cette facture (l'acheteur)
      field: "customer_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gerantId: {
      //FK
      //ID (utilisateur) de la personne qui était gérant buvette pour cette commande
      field: "gerant_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleId: {
      //L'article indiqué sur cette ligne de facture.
      type: DataTypes.INTEGER,
      field: "article_id",
      allowNull: false,
    },
    article: {
      //Son nom
      type: DataTypes.STRING,
      field: "article",
      allowNull: false,
    },
    quantite: {
      //Quantité de cet article inclue dans cette ligne de la facture
      type: DataTypes.INTEGER,
      field: "quantite",
      allowNull: false,
    },
    prixUnitaire: {
      //Prix unitaire de l'article
      type: DataTypes.FLOAT,
      field: "prix_unitaire",
      allowNull: false,
    },
    prixSomme: {
      //Prix uniaire x quanité
      type: DataTypes.FLOAT,
      field: "prix_somme",
      allowNull: false,
    },
  });

  return invoiceLine;
};

//Tutos for
//One to many https://bezkoder.com/sequelize-associate-one-to-many/
//Many to many https://bezkoder.com/sequelize-associate-many-to-many/
