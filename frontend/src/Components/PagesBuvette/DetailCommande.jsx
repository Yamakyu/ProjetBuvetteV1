import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import DoTheThings from '../Utility/DoTheThings';

export default function DetailCommande() {

  const {isUserTokenExpired, activeSession} = useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const { id } = useParams();
    const [invoice, setInvoice] = useState({});
    const [invoiceDetails, setInvoiceDetails] = useState([]);

    

//------------------------------------------------------------------------- USE EFFECT

  useEffect(() => {
    
    apiGetInvoiceById();
    apiGetInvoiceDetails();
  
    return () => {}
  }, [])
  

//------------------------------------------------------------------------- REQUÊTES

  const apiGetInvoiceById = async () => {
    console.log("Returning that invoices...");

    await fetch("/api/invoices/"+id,{
        method: "GET",
        headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("API response ↓");
        console.log(data.message);

        if (isUserTokenExpired(data)){
            myAppNavigator("/login");
        }
        setInvoice(data.thatInvoice);
    })
    .catch((err) => {
        console.log(err.message);
        console.log(err);
    });
  }

  const apiGetInvoiceDetails = async () => {
    console.log("Returning invoice details...");

  

    await fetch("/api/invoices/details/"+id,{
        method: "GET",
        headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("API response ↓");
        console.log(data.message);

        if (isUserTokenExpired(data)){
            myAppNavigator("/login");
        }
        setInvoiceDetails(data.resultArray);
    })
    .catch((err) => {
        console.log(err.message);
        console.log(err);
    });
  }


//------------------------------------------------------------------------- AFFICHAGE

  return (
    <div className='BoxSimple'>
      <div className='OrderCard'>
        <h3 style={{margin:"5px", fontWeight:"lighter"}}>Facture #{invoice.id}
        <br />
        <br />
        <div style={{fontWeight:"normal"}}>
          Commande pour <b ><i>{invoice.customer}</i></b>, validée par <b>{invoice.gerant}</b>.
        </div>
        <hr className='FancyBr'/>
        <u>Détails de la commande :</u> </h3>
        
        <h3>
            {Object.entries(invoiceDetails).map(([objectKey, ligneDeFacture]) => {
              return(
                <li key={objectKey}>
                  {ligneDeFacture.quantite} {ligneDeFacture.article}{ligneDeFacture.quantite > 1 ? "s":""} - {ligneDeFacture.prixSomme}€
                  <ul style={{fontSize:"13px"}}>
                    (Prix unitaire : {ligneDeFacture.prixUnitaire}€)
                  </ul>
                </li>
              )
            })}
          {invoice.discount !== 0 
            ?<div>
              <h4 style={{fontWeight:"lighter"}}>Montant total : {invoice.totalAmount} €
              <br />
              (Réduction : {invoice.discount}%)</h4> 
              <h3>Montant total après réduction : {invoice.totalAmountDiscounted} €</h3>
            </div>
            : <h3>Montant total : {invoice.totalAmountDiscounted} €</h3> 
          }  
          <br />

          {(invoice.commentaire) && (invoice.commentaire.length !== 0)
            ? <div style={{margin:'5px'}}>
              Commentaire : <i style={{fontWeight:"lighter"}}>"{invoice.commentaire}"</i>
            </div>
            : "" }

          </h3>
          Commande datée du <b>{invoice.createdAt !== undefined ? invoice.createdAt.substring(0,10) : invoice.createdAt }</b>
          <br style={{margin:'5px'}}/>
      </div>

      <button className='SubButton' onClick={() => myAppNavigator("/manage/buvette/invoices")}>Historique des commmandes </button>

    </div>
  )
}
