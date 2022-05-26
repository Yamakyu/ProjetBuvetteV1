import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import DoTheThings from '../Utility/DoTheThings';

export default function VerifierCommande() {
    
    const { activeSession, isUserTokenExpired, currentOrder, setCurrentOrder, fullUserList, setFullUserList } = useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountDiscounted, setTotalAmountDiscounted] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [reducedOrder, setReducedOrder] = useState([{}]);
    const [apiResponse, setApiResponse] = useState("");
    const [validateOrderResponse, setValidateOrderResponse] = useState("");
    const [orderComment, setOrderComment] = useState("");
    const [commentWarning, setCommentWarning] = useState("");

    const [isCommentValid, setisCommentValid] = useState(true);
    const [isCancellingOrder, setIsCancellingOrder] = useState(false);
    const [isFirstOrder, setIsFirstOrder] = useState(false);
    const [isOrderForSelf, setIsOrderForSelf] = useState(false);
    const [isValidatingAddCustomerInput, setisValidatingAddCustomerInput] = useState(false);
    const [isOrderReady, setIsOrderReady] = useState(false);

    const [userListResult, setUserListResult] = useState([]);
    //const [userListFull, setUserListFull] = useState([]);
    const [nameToLookFor, setNameToLookFor] = useState("");
    const [customer, setCustomer] = useState({});
    const [newCustomer, setNewCustomer] = useState({
        nom:"",
        prenom:"",
        email:"",
    });
    
//------------------------------------------------------------------------- USE EFFECT

    useEffect(() => {

        if(currentOrder.length===0){
            myAppNavigator("/manage/buvette/orders/new");
        }

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
        setIsCancellingOrder(false);

        if(inputEvent.target.value != 1 && isStringEmpty(orderComment)){
            setisCommentValid(false);
        }else{
            setisCommentValid(true);
        }
    }

    const handleComment = (inputEvent) => {
        if (!isStringEmpty(inputEvent.target.value)){
            setisCommentValid(true);
            setCommentWarning('')
        }else{
            setisCommentValid(false)
        }
        setOrderComment(inputEvent.target.value);
    }

    const handleCustomerInputSelect = (inputEvent) => {
        setApiResponse("");
        setValidateOrderResponse("");
        setIsCancellingOrder(false);
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
            setisValidatingAddCustomerInput(false);
            return setApiResponse("Vous devez remplir tout les champs !");
        }else{
            setisValidatingAddCustomerInput(true);
            return setApiResponse("");
        }


        /*
        let userAlreadyExists = false;
        
        if(fullUserList){
            fullUserList.forEach((user) => {
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
        */
    }

//------------------------------------------------------------------------- REQUÊTES

    const apiSearchUsersByName = async (thatName) => {   
        console.log("recherche : " + thatName);
        setApiResponse("Recherche en cours. Cela peut prendre quelques instants...");

        fetch("/api/users/search/name?name="+thatName,{
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
                setFullUserList(data.resultArray);
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


                console.log(data.addedUser);
    
                if (data.success){
                    setNewCustomer({
                        nom:"",
                        prenom:"",
                        email:"",
                    })
                }else {
                    setNewCustomer(() => ({
                        ...newCustomer, 
                        email: "",
                    }))
                }




        })
        .catch((err) => console.log(err));
    }

    const apiCompleteOrder = async () => {    
        setValidateOrderResponse("L'opération peut prendre quelques instants. Veuillez patienter... ");
        
        /*
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
        */


        await fetch("/api/invoices/add",{
            method: "POST",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
                    customerId: customer.id,
                    customer: `${customer.nom} ${customer.prenom}`,
                    gerantId: activeSession.userInfo.id,
                    gerant: `${activeSession.userInfo.nom} ${activeSession.userInfo.prenom}`,
                    commentaire: orderComment,
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
        <h1 className='PageName'>Veuillez vérifier la saisie</h1>

        <div className='BoxSimple'>
            <div className='OrderCard'>
                <h2>Résumé de la commande : </h2>
                <div>
                    <h3>
                        {Object.entries(reducedOrder).map(([objectKey, article]) =>
                            {
                                return(
                                    <li key={objectKey}>    
                                    {article.quantite} {article.nom}{article.quantite > 1 ? "s":""} - {article.prixUnitaire * article.quantite} € 
                                        <ul style={{fontSize:"13px"}}>
                                            (Prix unitaire : {article.prixUnitaire}€)
                                        </ul>
                                        <div className='FancyBr'/>
                                    </li>
                                )
                            })
                        }     
                    </h3>
                    <br />

                    <button className='MiniCardSubButton' onClick={() => myAppNavigator("/manage/buvette/orders/new")}>Modifier cette commande</button>
                    <button className='MiniCardCancelButton' onClick={() => setIsCancellingOrder(true)}>Annuler cette commande</button>
                    <br />
                    <br />
                    <div className='OrderCancelSubCard'>
                        <h4 hidden={!isCancellingOrder} style={{marginTop:"5px"}}> 
                            Voulez vous vraiment retirer tout les articles de cette commande ? 
                        </h4>
                        <button className='MiniCardRedButton' hidden={!isCancellingOrder} onClick={cancelOrder}>Confirmer l'annulation de la commande</button>
                    </div>
                </div>
                <br />            
                <label>
                    Pourcentage à payer {" "}
                    <select onChange={handleDiscountInputSelect} defaultValue={1}>
                        <option value={1}>100%</option>
                        <option value={0.5}>50%</option> 
                        <option value={0}>0%</option>
                    </select>
                </label>
                <div hidden={isCommentValid} className='APIResponse'>
                Un commentaire est requis pour une commande payée à {((1-discount) * 100)}%
                </div>
                <div style={{marginTop:"20px"}}>↓ Commentaires ↓</div>
                <textarea 
                    value={orderComment} 
                    style={{marginTop:"10px"}} 
                    rows={5}
                    onChange={handleComment}
                />
                <br />
                <h2>Montant total : {totalAmountDiscounted} €</h2>
            </div>
        
            <br className='FancyBr' />

            <div className='ClientCard' hidden={!isCommentValid}>
                <label>
                    <h4>Veuillez identifier la/le client.e</h4>
                    <select onChange={handleCustomerInputSelect} defaultValue="notNew">
                        <option value="notNew">La/le client.e a déjà commandé avant</option>
                        <option value="new">La/le client.e commande pour la première fois</option> 
                        <option value="myself">Je commande pour moi même, {activeSession.userInfo.nom} {activeSession.userInfo.prenom}</option> 
                    </select>
                </label>

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
                    <button onClick={() => apiSearchUsersByName(nameToLookFor)}>Afficher les utilisateurs</button>
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
                <form onSubmit={prepareAddCustomer} hidden={isOrderForSelf || !isFirstOrder}>
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
                    <button >Valider la saisie</button>
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
                </form>
                <br />


            <h3>
            {(isOrderReady && isCommentValid)
                ?   `Cette commande sera attribuée à ${customer.nom} ${customer.prenom}`
                :   ""
            }
            </h3>
            {/*<button disabled={!isOrderReady && isStringEmpty(orderComment)} onClick={apiCompleteOrder}>Valider la commande</button>*/}
            {validateOrderResponse}
            <button disabled={!isOrderReady || !isCommentValid} className='ConfirmButton' onClick={apiCompleteOrder}>Valider la commande</button>
            
            </div>            
        </div>
    </div>
  )
}
