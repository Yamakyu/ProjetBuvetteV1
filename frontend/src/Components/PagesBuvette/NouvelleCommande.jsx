import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionContext } from '../../Contexts/SessionContext'
import DoTheThings from '../Utility/DoTheThings';
import FiltreArticle from '../Utility/FiltreArticle';
import ListeArticles from './ListeArticles';


export default function NouvelleCommande() {
  
//------------------------------------------------------------------------- INITIALISATION

  const { needOrderReset, setNeedOrderReset, activeSession, isUserTokenExpired, currentOrder, setCurrentOrder } = useContext(SessionContext);

  const myAppNavigator = useNavigate();

    const [articleListResult, setArticleListResult] = useState([]);
    const [fullArticlesList, setFullArticlesList] = useState([])
    const [myOrder, setMyOrder] = useState(currentOrder);
    const [apiSearchResponse, setApiSearchResponse] = useState("");
    const [searchWarning, setSearchWarning] = useState("");
    const [isListFiltered, setIsListFiltered] = useState(false);
    const [isOrderSorted, setisOrderSorted] = useState(false);
    const [isCancellingOrder, setIsCancellingOrder] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

//------------------------------------------------------------------------- USE EFFECT

  useEffect(() => {
    
    if(typeof(currentOrder) !== Array){
      setCurrentOrder([]);
      setMyOrder([]);
    }

    apiGetAllArticles();
    sortOrder();

    let tempTotal = 0;
    myOrder.forEach(article => {
        tempTotal += article.prixUnitaire
    }) 
    setTotalAmount(tempTotal);

  return () => {
    //
  }
  }, [])  

//------------------------------------------------------------------------- METHODES DE PRÉPARATON DE REQUÊTE

const isFilterValid = (filter) => {
  if (filter === null || filter === undefined || filter === "" || filter.replace(/\s+/g, '') === ""){
      setSearchWarning(" Vous ne pouvez pas faire de recherche vide")
      return false;
  }else{
      setSearchWarning("")
      return true;
  }
}

//------------------------------------------------------------------------- METHODES DE TRAITEMENT

  const addToOrder = (article) => {
    setMyOrder((prevState) => ([
      ...prevState, article
    ]));

    setTotalAmount(() => {
      return (totalAmount + article.prixUnitaire)
    })

    setisOrderSorted(false);
    setIsCancellingOrder(false);
  }

  const removeFromOrder = (indexToRemove) => {
    let thatArticleRemoved = myOrder[indexToRemove];

    setMyOrder([
      ...myOrder.slice(0, indexToRemove),     //Les éléments de MyOrder qui se trouvent *avant* l'objet à retirer
      ...myOrder.slice(indexToRemove + 1)     //Les éléments de MyOrder qui se trouvent *après* l'objet à retirer
    ]);

    /*
    Afin de garder la liste à jour en temps réel, il convient de la modifier avec setState. 
    Cependant, on ne peut pas retirer un élément d'un array avec array.splice(index, nbr) car splice retourne l'élément supprimé au lieu de l'array. 
    Ici on sépare l'array en deux, à l'index de l'objet à retirer, et on créée un nouvel array à partir de ces 2 moitiés.
    Ce nouvel array est passé en paramètre de setMyOrder([partie1, partie2]).

    https://stackoverflow.com/a/69458984/18893365
    */    

    setTotalAmount(() => {
      return (totalAmount - thatArticleRemoved.prixUnitaire)
    })

    setisOrderSorted(false);
    setIsCancellingOrder(false);
  }

  const cancelOrder = () => {
    setMyOrder([]);
    setCurrentOrder([]);
    setTotalAmount(0);
    setIsCancellingOrder(false);
  }

  //Permet de trier les articles par leur ID, ce qui facilite la lecture par l'humain.
  const sortOrder = () => {
    setMyOrder(() => [
      ...(myOrder.sort((a, b) => {
        return a.id - b.id;
      }))
    ])
      
    setisOrderSorted(true);
  }    
  
  const checkOrder = () => {
    setCurrentOrder(myOrder);
    myAppNavigator("/manage/buvette/orders/check");

  }

  const resetSearch = () => {
    setArticleListResult(fullArticlesList);
    setIsListFiltered(false);
}

//-------------------------------------------------------------------------  REQUÊTES


  const apiSearchArticlesByName = (searchFilter, checkUnavailableArticles) => {

    if (!isFilterValid(searchFilter)){
      return;
    }
    
    fetch("/api/articles/search?name="+searchFilter,{
        method: "POST",
        headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
        body: JSON.stringify(
            {
                //Si on demande à vérifier les articles non disponible, on retourne tout les articles. Cela correspond à "null" dans le backend. Si on veut exclusivement les articles disponibles (checkUnavailableArticles = false) cela correspond à true dans le backend.
                isOnlyAvailableArticles: checkUnavailableArticles ? null : true 
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

        setApiSearchResponse(data.message);
        setArticleListResult(data.resultArray);
        setIsListFiltered(true);
    })
    .catch((err) => {
        console.log(err.message);
        console.log(err);
    });
  }

  const apiSearchArticlesByCategory = (searchFilter, checkUnavailableArticles) => {
    
    if (!isFilterValid(searchFilter)){
        return;
    }
    
    fetch("/api/articles/category",{
        method: "POST",
        headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
        body: JSON.stringify(
            {
                //Si on demande à vérifier les articles non disponible, on retourne tout les articles. Cela correspond à "null" dans le backend. Si on veut exclusivement les articles disponibles (checkUnavailableArticles = false) cela correspond à true dans le backend.
                filter: searchFilter,
                isOnlyAvailableArticles: checkUnavailableArticles ? null : true 
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

        setApiSearchResponse(data.message);
        setArticleListResult(data.resultArray);
        setIsListFiltered(true);
    })
    .catch((err) => {
        console.log(err.message);
        console.log(err);
    });


  }

  const apiGetAllArticles = () => {

    fetch("/api/articles/all",{
      method: "POST",
      headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
      body: JSON.stringify(
        {
          isOnlyAvailableArticles: true,
        })
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("API response ↓");
      console.log(data.message);
      console.log(data.resultArray);

      if (isUserTokenExpired(data)){
        myAppNavigator("/login");
      }
      setArticleListResult(data.resultArray);
      setFullArticlesList(data.resultArray);
      setIsListFiltered(false);
      setApiSearchResponse("");
    })
    .catch((err) => {
      console.log(err.message);
      console.log(err);
    });    
  }

//------------------------------------------------------------------------- AFFICHAGE

  return (
    <div> 
      <h1 className='PageName'>Nouvelle commande</h1>
      <h2>Contenu de la commande : </h2>
      {myOrder 
      ? myOrder.map((article, index) => {
        return(
          <li key={index}> 1 {article.nom} : {article.prixUnitaire}€ <button className='TinyCancelButton' onClick={() => removeFromOrder(index)}> X </button>
          </li>
        )
      })
      : ""}

      <h4>Montant total : {totalAmount} €</h4>

      <br />
      <button className='MiniCardSubButton' disabled={isOrderSorted} onClick={sortOrder}>Trier les articles</button>
      <button className='MiniCardCancelButton' disabled={myOrder.length === 0} onClick={() => setIsCancellingOrder(true)}>Annuler la commande</button>
      <button className='MiniCardConfirmButton' disabled={myOrder.length === 0} onClick={checkOrder}>Valider la commande</button>
      <br />
      <br />
      <div hidden={!isCancellingOrder}> Voulez vous vraiment retirer tout les articles de cette commande ? </div>
      <button className='MiniCardRedButton' hidden={!isCancellingOrder} onClick={cancelOrder}>Confirmer l'annulation de la commande</button>

      <hr />
      <FiltreArticle 
        setIsListFiltered = {setIsListFiltered}
    
        searchWarning = {searchWarning}
        setSearchWarning = {setSearchWarning}

        setArticleListResult={setArticleListResult}
        fullArticlesList={fullArticlesList}
    
        apiSearchByName = {apiSearchArticlesByName}
        apiSearchByCategory = {apiSearchArticlesByCategory}
      />
      <br />
      { isListFiltered 
          ? <button className='MiniCardCancelButton' onClick={resetSearch}>Annuler la recherche et afficher la liste de tout les articles</button>
          : "" }
      <ListeArticles 
        articles={articleListResult} 
        apiSearchResponse={apiSearchResponse} 
        displayAddToOrderButtonChild={true}
        displayDetailsButtonChild={false}
        addToOrderChild={addToOrder}
        isOrderingChild={true}
      />
      {/* Ce composant appelle lui même le composant Article. L'indication "Child" sur un nom de props indique que cet élément est réceptionné par le composant MiniArticle, enfant du composant ListeArticle */}
      { isListFiltered 
          ? <button className='MiniCardCancelButton' onClick={resetSearch}>Annuler la recherche et afficher la liste de tout les articles</button>
          : "" }
    </div>
  )
}
