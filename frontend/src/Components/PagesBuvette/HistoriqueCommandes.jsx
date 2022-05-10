import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import DoTheThings from '../Utility/DoTheThings';

export default function HistoriqueCommandes() {

    const {activeSession, isUserTokenExpired, fullUserList, setFullUserList} = useContext(SessionContext)

    const [invoiceListFull, setInvoiceListFull] = useState([]);     //invoiceListFull est la liste complète des commandes, et ne sera jamais changé
    const [invoiceListResult, setInvoiceListResult] = useState([]);             //invoiceList est la liste affichée des commandes, et est susceptible d'être filtrée
    const [userListResult, setUserListResult] = useState([]);
    //const [userListFull, setUserListFull] = useState([]);
    const [customerListFull, setCustomerListFull] = useState([]);
    const [gerantListFull, setGerantListFull] = useState([]);
    const [apiSearchResponse, setApiSearchResponse] = useState("");
    const [searchTool, setSearchTool] = useState("");
    const [searchWarning, setSearchWarning] = useState("");
    const [searchType, setSearchType] = useState("all");
    const [isListFiltered, setIsListFiltered] = useState(false);
    const [isSearchByDate, setIsSearchByDate] = useState(false);

    const myAppNavigator = useNavigate();
    
//------------------------------------------------------------------------- USE EFFECT

    useEffect(() => {
        apiGetAllInvoices();
        apiGetAllUsers();
        apiGetGerantID();   //On obtient gerantListFull dans cette API.
        
        return () => {}
    }, [])


    useEffect(() => {
        setUserListResult(fullUserList);

        let tempCustomerList = [];

        fullUserList.forEach(user => {
            if(user.nbrOrders >= 1){
                tempCustomerList.push(user);
            }
        })
        let orderedCustomerList = tempCustomerList.sort((a,b) => 
            (a.nom.toLowerCase() > b.nom.toLowerCase()) ? 1 : ((b.nom.toLowerCase() > a.nom.toLowerCase()) ? -1 : 0)
        )
        setCustomerListFull(orderedCustomerList);
      return () => {}
    }, [fullUserList])
    


//------------------------------------------------------------------------- METHODES DE TRAITEMENT

    const handleDateInputSelect = (inputEvent) => {
        setSearchTool("");
        const spanOfTime = inputEvent.target.value;
        console.log(spanOfTime);
    }

    const handleInputSelect = async (inputEvent) => { 
        setSearchType(inputEvent.target.value);

        setSearchWarning("");
        setIsSearchByDate(inputEvent.target.value === "date");

        switch (inputEvent.target.value) {
            case "all":
            case "date":
                setUserListResult([]);
                setApiSearchResponse('');
                setInvoiceListResult(invoiceListFull)
                setIsListFiltered(false);      
                break;
            case "myself":
            case "selfOrder":  
                handleFilterUsers(activeSession.userInfo, inputEvent.target.value);
                break;
            case "gerant":
                setUserListResult(gerantListFull);
                break;
            case "customer":
                setUserListResult(customerListFull);
                break;
            default:
                break;
        }
    }

    const handleFilterUsers = (thatUser, search) => {
        let filteredInvoiceList = [];
        setIsListFiltered(true);
        
        if(invoiceListFull === undefined || invoiceListFull.length===0){
            setApiSearchResponse("Aucune facture à afficher")
            return;
        }
        setApiSearchResponse("Résultats de la recherche : ")

        invoiceListFull.forEach(facture => {
            if(((facture.customerId === thatUser.id) && (search==="customer")) 
            || ((facture.customerId === thatUser.id) && (search==="selfOrder"))
            || ((facture.gerantId === thatUser.id) && (search==="gerant"))
            || ((facture.gerantId === thatUser.id) && (search==="myself"))){
                filteredInvoiceList.push(facture);
            }
        });


        if (filteredInvoiceList.length !==0)
        {
            setInvoiceListResult(filteredInvoiceList)
        }else{
            setInvoiceListResult([]);
            setApiSearchResponse("Aucun résultat")
        }
    }

    const cancelFilter = () => {
        setInvoiceListResult(invoiceListFull);
        setIsListFiltered(false);
        setApiSearchResponse("");
    }

    const filterUserResults = (searchFilter) => {
        let filteredUserList = [];
        let nonFilteredUserList = userListResult;

        console.log(searchFilter);

        //Si le filtre est vide, on retourne les utilisateurs tels quels
        if(!isFilterNotEmpty(searchFilter)){
            setUserListResult(nonFilteredUserList);
            return;
        }

        userListResult.forEach(user => {
            if(user.nom.includes(searchFilter) || user.prenom.includes(searchFilter)){
                filteredUserList.push(user);
            }
        })

        if (filteredUserList.length !==0)
        {
            setUserListResult(filteredUserList);
            setSearchWarning("");
        }else{
            setSearchWarning("Aucun résultat pour ce nom ou prénom");
        }
    }

    const displaySearchTool = () => {
        let nameToLookFor;

        setSearchTool(
            <div>
                Vous pouvez chercher un nom ou prénom

                <input
                placeholder="Entrez un nom"
                value={nameToLookFor}
                type="text"
                onChange={(e) => nameToLookFor = e.target.value}
                name="searchName"
                />
                <br/>
            
                <button onClick={() => filterUserResults(nameToLookFor)}>Lancer la recherche</button>
            </div>
        );
    }

    const isFilterNotEmpty = (filter) => {
        if (filter === null || filter === undefined || filter === "" || filter.replace(/\s+/g, '') === ""){
            setSearchWarning(" Vous ne pouvez pas faire de recherche vide")
            return false;
        }else{
            setSearchWarning("")
            return true;
        }
    }

//------------------------------------------------------------------------- REQUÊTES

    const apiGetAllInvoices = async () => {
        console.log("Returning all invoices...");

        await fetch("/api/invoices/all",{
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
            setInvoiceListFull(data.resultArray);
            setInvoiceListResult(data.resultArray)
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });
    }

    const apiGetAllUsers = async () => {
        
        await fetch("/api/users/search/all",{
            method: "POST",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
                    isInactiveAccountsIncluded : activeSession.userInfo.isAdmin, 
                }
            )
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);

            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }
            setUserListResult(data.resultArray);
            setFullUserList(data.resultArray);
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });

    }

    const apiGetGerantID = async () => {
        console.log("Returning gerants buvette");

        await fetch("/api/users/search/role",{
            method: "POST",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
                    filter: "Gerant Buvette",
                    isInactiveAccountsIncluded : activeSession.userInfo.isAdmin, 
                }
            )
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);

            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }
            setGerantListFull(data.resultArray.sort((a,b) => 
                (a.nom.toLowerCase() > b.nom.toLowerCase()) ? 1 : ((b.nom.toLowerCase() > a.nom.toLowerCase()) ? -1 : 0)
            ));
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });
    }

//------------------------------------------------------------------------- AFFICHAGE

    const theThing =() => {
        console.log("fullUserList");
        console.log(fullUserList);
        console.log("----------");
        console.log("userListResult");
        console.log(userListResult);
        console.log("----------");
        console.log("customerListFull");
        console.log(customerListFull);
        console.log("----------");
        console.log("gerantListFull");
        console.log(gerantListFull);
        console.log("----------");
    }


  return (
    <div>
        <DoTheThings 
        theThing={theThing}
        theOtherThing={null} 
        />
        <br />
        <div>
            <h3>
            
            <label>
                Afficher les commandes... {" "}
                <select onChange={handleInputSelect}>
                    <option value="all"> toutes </option>
                    <option value="myself"> validées par moi même, {activeSession.userInfo.nom} {activeSession.userInfo.prenom} </option>
                    <option value="gerant"> validées par (gérant) </option>
                    <option value="selfOrder"> à l'ordre de moi même, {activeSession.userInfo.nom} {activeSession.userInfo.prenom} </option>
                    <option value="customer"> à l'ordre de (consommateur)</option>
                    <option value="date"> datant (inactif pour le moment)</option>
                </select>
            </label>
            <label hidden={!isSearchByDate}>
                <select onChange={handleDateInputSelect}>
                    <option value="null"> (sélectionnez une période de temps) </option>
                    <option value="day"> d'aujourd'hui </option>
                    <option value="week"> des 7 derniers jours </option>
                    <option value="month"> des 30 derniers jours </option>
                    <option value="semester"> des 6 derniers mois </option>
                    <option value="year"> des 12 derniers mois</option>
                </select>
            </label>
            </h3>
            <ul hidden={(userListResult.length === 0) || (searchType=== "all") || (searchType=== "myself") || (searchType=== "selfOrder")}>
                {userListResult.map(user => {
                    return(
                        <li key={user.id}>
                                {user.nom} {user.prenom} {user.isActiveAccount ? "" : "(compte inactif)"}
                                    <button onClick={() => handleFilterUsers(user, searchType)}>Afficher les commandes</button>
                            </li>
                        )
                    })}
            </ul>
            { searchTool }
            { searchWarning }
        </div>

        <hr />

        <h2>
        {invoiceListFull === undefined 
            ? "Il n'y a pas encore eu de commande." 
            : (apiSearchResponse || " Liste de toutes les commandes :")}
        <br />
        { isListFiltered 
            ? <button onClick={cancelFilter}>Annuler la recherche et afficher la liste de toutes les commandes</button>
            : "" }
        </h2>
        {invoiceListResult !== undefined 
            ?   <ul>
                    {invoiceListResult.map(facture => {
                        return(
                            <div key={facture.id}>
                                    <button onClick={() => myAppNavigator(`/manage/buvette/invoices/details/${facture.id}`)}>Voir les détails</button>
                                {" "}Commande #{facture.id} || À l'ordre de <b>{facture.customer}</b>, le {facture.createdAt.substring(0,10)} || <b>{facture.totalAmountDiscounted}€</b> {facture.discount !== 0 ? `(après ${facture.discount}% de réduction) ` : ""}
                            </div>
                        )
                    })}
                </ul>
            
            : ""
            }
    </div>
  )
}
