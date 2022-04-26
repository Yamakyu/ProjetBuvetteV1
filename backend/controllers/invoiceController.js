require("dotenv").config();
const db = require("../models");
const Invoice = db.invoices;
const InvoiceLines = db.invoiceLines;
const Users = db.users;
const Op = db.Sequelize.Op;
//const os = require("os");

// ---------- POST ----------- (testé)
exports.addInvoice = async (req, res) => {
  console.log("INVOICE controller : addInvoice -------");

  //Vérification des droits de l'utilisateur qui fait la requête
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

    //On parse la requête avant de la transmettre à Sequelize
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

    //En cas de succès...
    if (
      invoiceCreationResult.id !== null ||
      invoiceCreationResult.id !== undefined
    ) {
      //... on va tenter d'indiquer que l'utilisateur a une commande supplémentaire
      let addOrderToUserResult = false;

      await Users.findByPk(invoiceInfo.customerId)
        .then((data) => {
          let nbrOrders = data.nbrOrders + 1;
          Users.update({ nbrOrders }, { where: { id: invoiceInfo.customerId } })
            .then((result) => {
              console.log("resultat");
              console.log(result);
              addOrderToUserResult = result >= 1;
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => displayThatError(error));

      let invoiceLines = [];

      requestBody.orderLines.forEach((line) => {
        invoiceLines.push({
          invoiceId: invoiceCreationResult.id,
          customerId: invoiceInfo.customerId,
          gerantId: invoiceInfo.gerantId,
          article: line.nom,
          articleId: line.id,
          quantite: line.quantite,
          prixUnitaire: line.prixUnitaire,
          prixSomme: line.quantite * line.prixUnitaire,
        });
      });

      //Que l'opération ait réussi ou pas, on crééé les détails de la commande.
      await InvoiceLines.bulkCreate(invoiceLines)
        .then((data) => {
          console.log(`------- Détails de factures ajoutés`);
          return res.status(200).json({
            message: addOrderToUserResult
              ? "La commande a bien été enregistrée !"
              : "La commande a été enregistrée, mais n'a pas pu être ajoutée à l'utilisateur",
            invoiceLines,
            invoice: invoiceCreationResult,
          });
        })
        .catch((error) => displayThatError(res, error));
    }
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- GET ----------- (testé)
exports.findInvoiceByID = async (req, res) => {
  console.log("INVOICE controller : findInvoiceById -------");

  try {
    let invoiceID = req.params.id;
    await Invoice.findByPk(invoiceID)
      .then((thatInvoice) => {
        return res.status(200).json({
          message: "Facture trouvée",
          thatInvoice,
        });
      })
      .catch((error) => displayThatError(res, error));
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- GET ----------- (testé)
exports.findInvoiceByCustomerID = async (req, res) => {
  console.log("INVOICE controller : findInvoiceByCustomerID -------");

  try {
    let theseInvoices;
    let customerID = req.params.id;

    theseInvoices = await Invoice.findAll({
      where: { customerId: customerID },
    });

    displayTheseResults(res, theseInvoices);
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- GET ----------- (testé)
exports.findInvoiceByGerantID = async (req, res) => {
  console.log("INVOICE controller : findInvoiceByGerantID -------");

  try {
    let theseInvoices;
    let gerantID = req.params.id;

    theseInvoices = await Invoice.findAll({
      where: { gerantId: gerantID },
    });

    displayTheseResults(res, theseInvoices);
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- GET ----------- (testé)
exports.findInvoiceDetailsByInvoiceID = async (req, res) => {
  console.log("INVOICE controller : findInvoiceDetailsByInvoiceID -------");

  try {
    let theseInvoicesLines;
    let invoiceID = req.params.id;

    theseInvoicesLines = await InvoiceLines.findAll({
      where: { invoiceId: invoiceID },
    });

    displayTheseResults(res, theseInvoicesLines);
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- GET ----------- (testé)
exports.findAllInvoices = async (req, res) => {
  console.log("INVOICE controller : findAllInvoices -------");

  try {
    let theseInvoices;
    theseInvoices = await Invoice.findAll();

    displayTheseResults(res, theseInvoices);
  } catch (error) {
    displayThatError(res, error);
  }
};

// ---------- PUT ----------- ()
exports.editInvoice = async (req, res) => {
  console.log("INVOICE controller : editInvoice -------");

  try {
    const invoiceToUpdateID = req.params.id;

    console.log(req.body);

    let parsedInvoicePaidStatus = {
      isInvoicePaid: req.body.isInvoicePaid,
    };

    await Invoice.update(parsedInvoicePaidStatus, {
      where: { id: invoiceToUpdateID },
    })
      .then((num) => {
        if (num > 0) {
          console.log(
            "----- Facture marquée comme payée. En attente de le récupérer.... -------"
          );
        } else {
          return res.status(500).json({
            message: `Impossible de modifier la facture dont l'id est ${invoiceToUpdateID}.`,
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Erreur en modifiant la facture id=${invoiceToUpdateID} : + ${error}`,
          error,
        });
      });

    let thatInvoiceUpdated = await Invoice.findByPk(invoiceToUpdateID);

    if (thatInvoiceUpdated === null || thatInvoiceUpdated === undefined) {
      return res.status(404).json({
        message: `Impossible de retourner la facture modifiée dont l'id est l'id=${invoiceToUpdateID}.`,
      });
    } else {
      return res.status(200).json({
        message: "Facture modifiée avec succès.",
        updatedInvoice: thatInvoiceUpdated,
      });
    }
  } catch (err) {
    displayThatError(res, err);
  }
};

//-----------------------------------------
//--------------FUNCTIONS------------------
//-----------------------------------------

let displayTheseResults = (requestResponse, resultArray) => {
  try {
    if (resultArray.length === 0) {
      return requestResponse.status(200).json({
        message: "Aucun résultat",
      });
    } else {
      return requestResponse.status(200).json({
        message: "Résultats de la recherche : ",
        resultArray,
      });
    }
  } catch (error) {
    displayThatError(requestResponse, error);
  }
};

let displayThatError = (requestResponse, thatError) => {
  console.log("↓ ------- Une erreur s'est produite ↓");
  console.log(thatError);
  return requestResponse.status(500).json({
    message: `Une erreur s'est produite lors de la requête : ${thatError}. Pour plus de détails, consultez la console.`,
    error: thatError,
  });
};
