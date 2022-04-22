module.exports = (sequelize, DataTypes) => {
  const invoiceSchema = sequelize.define("invoices", {
    id: {
      field: "invoice_id",
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    customerId: {
      //FK
      //ID (utilisateur) de la personne associée à cette facture (l'acheteur)
      field: "customer_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer: {
      //Son nom et prénom
      type: DataTypes.STRING,
      field: "customer",
      allowNull: false,
    },
    gerantId: {
      //FK
      //ID (utilisateur) de la personne qui était gérant buvette pour cette commande
      type: DataTypes.INTEGER,
      field: "gerant_id",
      allowNull: false,
    },
    gerant: {
      //Son nom et prénom
      type: DataTypes.STRING,
      field: "gerant_in_charge",
      allowNull: false,
    },
    commentaire: {
      //Commentaire entré par le gérant. Pour la réduction de paiement par exemple
      type: DataTypes.STRING,
      field: "commentaire",
      allowNull: true,
    },
    totalAmount: {
      //Montant total avant réduction éventuelle
      type: DataTypes.FLOAT,
      field: "montant_total",
      allowNull: false,
    },
    totalAmountDiscounted: {
      //Montant total après réduction éventuelle (identique au montant total si pas de réduction)
      type: DataTypes.FLOAT,
      field: "montal_total_avec_reduction",
      allowNull: false,
    },
    discount: {
      //0%, 50%, 100%
      type: DataTypes.INTEGER,
      field: "reduction",
      defaultValue: 0,
    },
    isInvoicePaid: {
      //Aucune idée si ce sera utile, mais permet de noter si la facture a été payée ou pas
      type: DataTypes.BOOLEAN,
      field: "facture_payée",
      defaultValue: false,
    },
  });

  return invoiceSchema;
};

//Tutos for
//One to many https://bezkoder.com/sequelize-associate-one-to-many/
//Many to many https://bezkoder.com/sequelize-associate-many-to-many/
