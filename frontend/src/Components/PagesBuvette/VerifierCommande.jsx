import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import DoTheThings from '../Utility/DoTheThings';

export default function VerifierCommande() {
    
    const { activeSession, isUserTokenExpired, currentOrder, setCurrentOrder } = useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountDiscounted, setTotalAmountDiscounted] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [reducedOrder, setReducedOrder] = useState([{}]);
    const [apiResponse, setApiResponse] = useState("");
    const [validateOrderResponse, setValidateOrderResponse] = useState("");
    const [orderComment, setOrderComment] = useState("");

    const [isCancellingOrder, setIsCancellingOrder] = useState(false);
    const [isFirstOrder, setIsFirstOrder] = useState(false);
    const [isOrderForSelf, setIsOrderForSelf] = useState(false);
    const [isValidatingAddCustomerInput, setisValidatingAddCustomerInput] = useState(false);
    const [isOrderReady, setIsOrderReady] = useState(false);

    const [userListResult, setUserListResult] = useState([]);
    const [userListFull, setUserListFull] = useState([]);
    const [nameToLookFor, setNameToLookFor] = useState("");
    const [customer, setCustomer] = useState({});
    const [newCustomer, setNewCustomer] = useState({
        nom:"",
        prenom:"",
        email:"",
    });
    
//------------------------------------------------------------------------- USE EFFECT

    useEffect(() => {

        //On aura besoin de pouvoir vérifier plus tard la présence ou pas d'un utilisateur.
        apiGetAllUsers();

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
        setTotalAmountDiscounted(tempTotal);

      return () => {
        //
      }
    }, [])

//------------------------------------------------------------------------- METHODE DE TRAITEMENT
    
    const cancelOrder = () =>{
        setCurrentOrder([]);
        myAppNavigator("/manage/buvette/orders/new");
    }

    const handleDiscountInputSelect = (inputEvent) => {
        setTotalAmountDiscounted(totalAmount * inputEvent.target.value)
        setDiscount(1-inputEvent.target.value);
    }

    const handleCustomerInputSelect = (inputEvent) => {
        setApiResponse("");
        setValidateOrderResponse("");
        setNewCustomer({
            nom:"",
            prenom:"",
            email:"",
        });

        switch (inputEvent.target.value) {
            case "new":
                setIsFirstOrder(true);
                setIsOrderForSelf(false);
                setisValidatingAddCustomerInput(false);
                setCustomer({});
                setIsOrderReady(false);
                break;
            case "notNew":
                setIsFirstOrder(false);
                setIsOrderForSelf(false);
                setCustomer({});
                setIsOrderReady(false);
                break;
            case "myself":
                setIsOrderForSelf(true);
                setCustomer(activeSession.userInfo)
                setIsOrderReady(true);
                break;
            default:
                break;
        }
    }

    const handleNewCustomerInput = (inputEvent) => {
        const { name, value } = inputEvent.target;

        setNewCustomer(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const isStringEmpty = (thatString) => {
        if (thatString === null || thatString === undefined || thatString === "" || thatString.replace(/\s+/g, '') === ""){
            return true;
        } else {
            return false;
        }
    }

    const selectCustomer = (thatUser) => {
        setCustomer(thatUser);
        setIsOrderReady(true);
    }


//------------------------------------------------------------------------- METHODES DE PRÉPARATON DE REQUÊTE

    const prepareAddCustomer = (formEvent) => {
        formEvent.preventDefault();
        console.log(newCustomer);

        if (isStringEmpty(newCustomer.nom) || isStringEmpty(newCustomer.prenom) || isStringEmpty(newCustomer.email)){
            return setApiResponse("Vous devez remplir tout les champs !");
        }

        let userAlreadyExists = false;
        
        if(userListFull){
            userListFull.forEach((user) => {
                if (user.email === newCustomer.email){
                    console.log("mail match !");
                    setApiResponse(`L'email ${newCustomer.email} est déjà utilisé !`);
                    userAlreadyExists = true;
                    return ;
                } else if ((user.nom === newCustomer.nom) && (user.prenom === newCustomer.prenom)){
                    console.log("name  match !");
                    setApiResponse(`${newCustomer.nom} ${newCustomer.prenom} a déjà effectué une commande auparavant !`);
                    userAlreadyExists = true;
                    return ;
                }
            })
        }

        if (!userAlreadyExists){
            setApiResponse("");
            setisValidatingAddCustomerInput(true);
        }
    }

//------------------------------------------------------------------------- REQUÊTES

    const apiSearchUsersByName = async (thatName) => {   
        console.log("recherche : " + thatName);
        setApiResponse("Recherche en cours. Cela peut prendre quelques instants...");

        fetch("/api/users/search?name="+thatName,{
            method: "POST",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);
            setApiResponse(data.message);

            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }
            setUserListResult(data.resultArray);
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });
}

    const apiGetAllUsers = async () => {
        console.log("Returning all users...");

            fetch("/api/users/search/all",{
                method: "POST",
                headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
                body: JSON.stringify(
                    {
                        isInactiveAccountsIncluded: true,
                    })
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("API response ↓");
                console.log(data.message);

                if (isUserTokenExpired(data)){
                    myAppNavigator("/login");
                }
                setUserListFull(data.resultArray);
            })
            .catch((err) => {
                console.log(err.message);
                console.log(err);
            });
    }

    const apiAddNewCustomer = async () => {

        setApiResponse("L'opération peut prendre quelques instants. Veuillez patienter... ");
        await fetch("/api/users/signup/customer",{
            method: "POST",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
                    nom: newCustomer.nom,
                    prenom:newCustomer.prenom,
                    email:newCustomer.email,
                })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);
            setApiResponse(data.message);

            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }

            if (data.addedUser !== undefined){
                console.log(data.addedUser);
                setCustomer(data.addedUser);  
                setIsOrderReady(true);
            }
        })
        .catch((err) => console.log(err));
    }

    const apiCompleteOrder = async () => {    
        //setValidateOrderResponse(`Pas d'API pour le moment, mais la commande d'un montent de ${totalAmountDiscounted} € pour ${customer.nom} ${customer.prenom} est prête`);

        setValidateOrderResponse("L'opération peut prendre quelques instants. Veuillez patienter... ");

        let completeOrder = {
            customerId: customer.id,
            customer: `${customer.nom} ${customer.prenom}`,
            gerantId: activeSession.userInfo.id,
            commentaire:"Pas de commentaire pour le moment",
            totalAmount: totalAmount,
            totalAmountDiscounted: totalAmountDiscounted,
            discount: discount * 100,
            orderLines: reducedOrder
        };


        await fetch("/api/invoices/add",{
            method: "POST",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
                    customerId: customer.id,
                    customer: `${customer.nom} ${customer.prenom}`,
                    gerantId: activeSession.userInfo.id,
                    gerant: `${activeSession.userInfo.nom} ${activeSession.userInfo.prenom}`,
                    commentaire:"Pas de commentaire pour le moment",
                    totalAmount: totalAmount,
                    totalAmountDiscounted: totalAmountDiscounted,
                    discount: discount * 100,
                    orderLines: reducedOrder
                })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);
            setValidateOrderResponse(data.message);

            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }

            if (data.invoiceLines !== undefined){
                setCurrentOrder(data.invoice);
                myAppNavigator("/manage/buvette/orders/completed")
            }
        })
        .catch((err) => console.log(err));

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
        <h3>
            {Object.entries(reducedOrder).map(([objectKey, article]) =>
                {
                    return(
                            <li key={objectKey}>    
                            {article.quantite} {article.nom}{article.quantite > 1 ? "s":""} - {article.prixUnitaire * article.quantite} € 
                                <ul style={{fontSize:"13px"}}>
                                    (Prix unitaire : {article.prixUnitaire}€)
                                </ul>
                            </li>
                    )
                })
            }     
        </h3>
        <br />

        <button onClick={() => myAppNavigator("/manage/buvette/orders/new")}>Modifier cette commande</button>
        <button onClick={() => setIsCancellingOrder(true)}>Annuler cette commande</button>
        <br />
        <br />
        <div hidden={!isCancellingOrder}> Voulez vous vraiment retirer tout les articles de cette commande ? </div>
        <button hidden={!isCancellingOrder} onClick={cancelOrder}>Confirmer l'annulation de la commande</button>

        </ul>
            <br />            
            <label>
                Pourcentage à payer 
                <select onChange={handleDiscountInputSelect} defaultValue={1}>
                    <option value={1}>100%</option>
                    <option value={0.5}>50%</option> 
                    <option value={0}>0%</option>
                </select>
            </label>
            <br />
            <h2>Montant total : {totalAmountDiscounted} €</h2>
            <br />
            <hr />
            <br />

            <label>
                Est-ce que la commande est pour une personne qui a déjà commandé auparavant ? 
                <br/>
                <select onChange={handleCustomerInputSelect} defaultValue="notNew">
                    <option value="notNew">Cette personne a déjà commandé avant</option>
                    <option value="new">Cette personne commande pour la première fois</option> 
                    <option value="myself">Cette commande est pour moi même, {activeSession.userInfo.nom} {activeSession.userInfo.prenom}</option> 
                </select>
            </label>

            <ul>
                {/* Formulaire de recherche d'un acheteur existant */}
                <div hidden={isOrderForSelf || isFirstOrder}>
                    Veuillez entrer son nom ou prénom. Laissez le champ vide pour afficher tout les utilisateurs.
                    <br />

                    <input
                    placeholder='Entrez un nom/prénom'
                    value={nameToLookFor}
                    type="text"
                    onChange={(e) => setNameToLookFor(e.target.value)}
                    name="searchName"
                    />
                    <button onClick={() => apiSearchUsersByName(nameToLookFor)}>Lancer la recherche</button>
                    <br/>
                    <br/>

                    {apiResponse}
                    {userListResult 
                        ?
                        <ul hidden={userListResult.length === 0}>
                            {userListResult.map((userFound) => {
                                return(
                                    <li key={userFound.id}>
                                        {userFound.nom} {userFound.prenom} <button onClick={() => selectCustomer(userFound)}> Sélectionner </button>
                                    </li>
                                )
                            })}
                        </ul>
                        :""
                    }




                </div>
                
                {/* Formulaire d'ajout d'un nouvel acheteur */}
                <div hidden={isOrderForSelf || !isFirstOrder}>
                    Veuillez entrer les informations de l'acheteur
                    <br />
                    <input
                        placeholder='nom'
                        value={newCustomer.nom}
                        type="text"
                        onChange={handleNewCustomerInput}
                        name="nom"
                    />
                    <input
                        placeholder='prenom'
                        value={newCustomer.prenom}
                        type="text"
                        onChange={handleNewCustomerInput}
                        name="prenom"
                    />
                    <input
                        placeholder='email'
                        value={newCustomer.email}
                        type="email"
                        onChange={handleNewCustomerInput}
                        name="email"
                    />
                    <button onClick={prepareAddCustomer}>Valider la saisie</button>
                    <br />
                    <br />

                    <div hidden={!isValidatingAddCustomerInput}>
                        Veuillez vérifier la saisie :
                        <ul >
                            {Object.entries(newCustomer).map(([objectKey, value]) => {
                                return(
                                    <li key={objectKey}> {objectKey} : {value} </li>
                                )
                            })}

                            <br />
                            <button onClick={apiAddNewCustomer}>La saisie est correcte</button>
                        </ul>
                    </div>
                    <br />
                    {apiResponse}
                </div>
                
            <br />
            </ul>
            <h3>
                {isOrderReady
                    ?   `Cette commande sera attribuée à ${customer.nom} ${customer.prenom}`
                    :   ""
                }
            </h3>
            <br />
            <br />
            {/*<button disabled={!isOrderReady && isStringEmpty(orderComment)} onClick={apiCompleteOrder}>Valider la commande</button>*/}
            {validateOrderResponse}
            <br />
            <button disabled={!isOrderReady} onClick={apiCompleteOrder}>Valider la commande</button>
            <br />
            <br />
            <br />
    </div>
  )
}
