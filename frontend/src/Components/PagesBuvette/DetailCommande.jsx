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
    <div>
      <DoTheThings
        theThing={null}
        theOtherThing={null} 
        />

      <h2>Facture #{invoice.id}, datée du {invoice.createdAt.substring(0,10)}</h2>
      <h3>Commande validée par {invoice.gerant}, pour <i>{invoice.customer}</i>.
      Détails de la commande : </h3>
      
      <h3>
        <ul>
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
          <br />
        {invoice.discount !== 0 
          ?<div>
            <h4>Montant total : {invoice.totalAmountDiscounted} €
            <br />
            Réduction : {invoice.discount}%</h4> 
            <br/>
            <h3>Montant total après réduction : {invoice.totalAmountDiscounted} €</h3>
          </div>
          : <h3>Montant total : {invoice.totalAmountDiscounted} €</h3> 
        }  
        </ul>
      </h3>


    </div>
  )
}
