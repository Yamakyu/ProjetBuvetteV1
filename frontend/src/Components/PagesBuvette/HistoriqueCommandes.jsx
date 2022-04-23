import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import DoTheThings from '../Utility/DoTheThings';

export default function HistoriqueCommandes() {

    const {activeSession, isUserTokenExpired} = useContext(SessionContext)

    const [invoiceList, setInvoiceList] = useState([]);

    const myAppNavigator = useNavigate();
    
//------------------------------------------------------------------------- USE EFFECT


    useEffect(() => {
      
        apiGetAllInvoices();
    
      return () => {}
    }, [])
    

//------------------------------------------------------------------------- REQUÊTES

    const apiGetAllInvoices = async () => {
        console.log("Returning all invoices...");

        fetch("/api/invoices/all",{
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
            setInvoiceList(data.resultArray);
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

        <h2>
            Liste des commandes : 
        </h2>
        <h4>
            <ul>
                {invoiceList.map(facture => {
                    return(
                        <li key={facture.id}>
                            Commande pour {facture.customer} du {facture.createdAt.substring(0,10)}. Montant total {facture.discount !== 0 ? "(après réduction) " : ""}: {facture.totalAmountDiscounted}€
                            <ul>
                                <button onClick={() => myAppNavigator(`/manage/buvette/invoices/details/${facture.id}`)}>Voir les détails</button>
                                <br />
                                <br />
                            </ul>
                        </li>
                    )
                })}
            </ul>
        </h4>
    </div>
  )
}
