require("dotenv").config();
const db = require("../models");
const Invoice = db.invoices;
const InvoiceLines = db.invoiceLines;
const Op = db.Sequelize.Op;
//const os = require("os");

// ---------- POST ----------- ()
exports.addInvoice = async (req, res) => {
  console.log("INVOICE controller : addInvoice -------");
  try {
    if (
      !req.thatRequestToken.isAdmin &&
      !req.thatRequestToken.isGerantBuvette
      //&& !req.thatRequestToken.isGerantMateriel       //Dans l'éventualité où on utilise la même contrôleur pour le stock
    ) {
      return res.status(401).json({
        message: "Vous n'êtes pas authorisés à effectuer cette action",
      });
    }

    let requestBody = req.body;

    console.log(requestBody);

    let invoiceInfo = {
      customerId: requestBody.customerId,
      customer: requestBody.customer,
      gerantId: requestBody.gerantId,
      gerant: requestBody.gerant,
      commentaire: requestBody.commentaire,
      totalAmount: requestBody.totalAmount,
      totalAmountDiscounted: requestBody.totalAmountDiscounted,
      discount: requestBody.discount,
    };

    let invoiceCreationResult = await Invoice.create(invoiceInfo);

    if (
      invoiceCreationResult.id !== null ||
      invoiceCreationResult.id !== undefined
    ) {
      let invoiceLines = [];

      requestBody.orderLines.forEach((line) => {
        invoiceLines.push({
          invoiceId: invoiceCreationResult.id,
          customerId: invoiceInfo.customerId,
          gerantId: invoiceInfo.gerantId,
          articleId: line.id,
          quantite: line.quantite,
          prixUnitaire: line.prixUnitaire,
          prixSomme: line.quantite * line.prixUnitaire,
        });
      });

      await InvoiceLines.bulkCreate(invoiceLines)
        .then((data) => {
          console.log(`------- Détails de factures ajoutés`);
          return res
            .status(200)
            .json({ message: "Factures ajoutées à la BdD !", invoiceLines });
        })
        .catch((error) => displayThatError(res, error));

      //   return res.status(200).json({
      //     message: "Bah chui un génie en fait",
      //     invoiceLines,
      //   });
    }
  } catch (error) {
    displayThatError(res, error);
  }
};

//-----------------------------------------
//--------------FUNCTIONS------------------
//-----------------------------------------

let displayThatError = (requestResponse, thatError) => {
  console.log("↓ ------- Une erreur s'est produite ↓");
  console.log(thatError);
  return requestResponse.status(500).json({
    message: `Une erreur s'est produite lors de la requête : ${thatError}. Pour plus de détails, consultez la console.`,
    error: thatError,
  });
};
