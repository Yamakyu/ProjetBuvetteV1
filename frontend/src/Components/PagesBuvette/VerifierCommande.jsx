import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import DoTheThings from '../Utility/DoTheThings';

export default function VerifierCommande() {
    
    const { activeSession, isUserTokenExpired, currentOrder, setCurrentOrder } = useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [totalAmount, setTotalAmount] = useState(0);
    const [reducedOrder, setReducedOrder] = useState([{}]);
    const [discount, setDiscount] = useState(1);
    const [apiResponse, setApiResponse] = useState("");
    const [isCancellingOrder, setIsCancellingOrder] = useState(false);

//------------------------------------------------------------------------- USE EFFECT

    useEffect(() => {
        let tempIDReducedOrder = {};

        //https://stackoverflow.com/a/65556546/18893365
        currentOrder.forEach((article) => {
            if (tempIDReducedOrder[article.id]) {
                tempIDReducedOrder[article.id] += 1;
            } else {
                tempIDReducedOrder[article.id] = 1;
            }
        });

        let tempReducedOrder = [];

        Object.entries(tempIDReducedOrder).map(([objectKey, value]) => {
            currentOrder.forEach(article => {
                if (article.id == objectKey){
                    tempReducedOrder.push({
                        id:article.id,
                        nom: article.nom,
                        prixUnitaire: article.prixUnitaire,
                        quantite: value
                    })
                }
            })
        })

        //https://stackoverflow.com/a/70406623/18893365
        setReducedOrder([...new Map(tempReducedOrder.map(v => [v.id, v])).values()]);


        let tempTotal = 0;
        currentOrder.forEach(article => {
            tempTotal += article.prixUnitaire
        }) 
    
        setTotalAmount(tempTotal);

      return () => {
        //
      }
    }, [])

//------------------------------------------------------------------------- METHODE DE TRAITEMENT
    
    const cancelOrder = () =>{
        setCurrentOrder([]);
        myAppNavigator("/manage/buvette/orders/new");
    }

//------------------------------------------------------------------------- AFFICHAGE

    const thatThing = () => {
        //console.log("hello");

        let testReducedOrder = {};

        currentOrder.forEach((article) => {
            if (testReducedOrder[article.id]) {
                testReducedOrder[article.id] += 1;
            } else {
                testReducedOrder[article.id] = 1;
            }
        });
        console.log(testReducedOrder);

        let testMyReducedOrder = [];
        Object.entries(testReducedOrder).map(([objectKey, value]) => {
            console.log("key - value");
            console.log(objectKey, value);

            currentOrder.forEach(article => {
                if (article.id == objectKey){
                    console.log("match !");

                    testMyReducedOrder.push({
                        id:article.id,
                        nom: article.nom,
                        prixUnitaire: article.prixUnitaire,
                        quantite: value
                    })
                }
            })
        })

        let definitiveMyReducedOrder = [...new Map(testMyReducedOrder.map(v => [v.id, v])).values()]

        
        console.log(definitiveMyReducedOrder);


    }

    const thatOtherThing = () => {
        console.log(currentOrder);
        console.log(reducedOrder);
    }


  return (
    <div>
        <DoTheThings
        theThing={thatThing}
        theOtherThing={thatOtherThing}       
        />

        <h2><u>Veuillez vérifier la saisie</u></h2>
        <br />

        <h3>Résumé de la commande : </h3>
        <ul>
            {Object.entries(reducedOrder).map(([objectKey, article]) =>
                {
                    return(
                        <h3>
                            <li key={objectKey}>    
                            {article.quantite} {article.nom}{article.quantite > 1 ? "s":""} - {article.prixUnitaire * article.quantite} € 
                                <ul style={{fontSize:"13px"}}>
                                    (Prix unitaire : {article.prixUnitaire}€)
                                </ul>
                            </li>
                        </h3>
                    )
                })
            }     
            <br />

            <button onClick={() => myAppNavigator("/manage/buvette/orders/new")}>Modifier cette commande</button>
            <button onClick={() => setIsCancellingOrder(true)}>Annuler cette commande</button>
            <br />
            <br />
            <div hidden={!isCancellingOrder}> Voulez vous vraiment retirer tout les articles de cette commande ? </div>
            <button hidden={!isCancellingOrder} onClick={cancelOrder}>Confirmer l'annulation de la commande</button>

        </ul>

            <br />
            <br />
            <br />
            [---Ici il y aura un sélecteur pour indiquer la réduction (0%, 50%, 100%)---]

            <br />
            <h2>Montant total : {totalAmount * discount} €</h2>



            [---Ici il y aura une barre de recherche pour entrer le nom de la personne qui commande---]
            <br />
            [---Si la personne n'a jamais commandé, on entre les coordonnées et c'est ajouté dans la base de données---]
            <br />
            <br />
            <br />
            <br />
            <button onClick={() => setApiResponse("[---Requête au backend pour ajouter la commande à la BdD---]")}>Valider la commande</button>

            <h2>{apiResponse}</h2>

    </div>
  )
}
