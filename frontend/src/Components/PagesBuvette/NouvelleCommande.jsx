import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SessionContext } from '../../Contexts/SessionContext'
import ListeArticles from '../Utility/ListeArticles';


export default function NouvelleCommande() {
  
//------------------------------------------------------------------------- INITIALISATION

  const { activeSession, isUserTokenExpired, currentOrder, setCurrentOrder } = useContext(SessionContext);

  const myAppNavigator = useNavigate();

    const [articleListResult, setArticleListResult] = useState([]);
    const [myOrder, setMyOrder] = useState([]);
    const [searchTool, setSearchTool] = useState();
    const [apiSearchResponse, setApiSearchResponse] = useState("");
    const [searchWarning, setSearchWarning] = useState("");
    const [isListFiltered, setIsListFiltered] = useState(false);
    const [cancelSearchButton, setCancelSearchButton] = useState();
    const [totalAmount, setTotalAmount] = useState(0);

//------------------------------------------------------------------------- USE EFFECT

  useEffect(() => {
          
    apiGetAllArticles();
    setCancelSearchButton(<button onClick={apiGetAllArticles}>Annuler la recherche et afficher la liste de tout les articles</button>);
    //Le bouton est set dans useEffect car "apiGetAllArticles" n'est déclaré qu'en fin de script, ce qui obligerai à assigner le bouton en fin de script.

  return () => {
    //
  }
  }, [])  

//------------------------------------------------------------------------- METHODES DE PRÉPARATON DE REQUÊTE



//------------------------------------------------------------------------- METHODES DE TRAITEMENT et REQUÊTES

  const addToOrder = (article) => {
    setMyOrder((prevState) => ([
      ...prevState, article
    ]));

    setTotalAmount(() => {
      return (totalAmount + article.prixUnitaire)
    })
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
      setIsListFiltered(false);
      setApiSearchResponse("");
    })
    .catch((err) => {
      console.log(err.message);
      console.log(err);
    });    
  }

//------------------------------------------------------------------------- AFFICHAGE

  const doTheThing = () => {
    //console.log("did the thing !");
    console.log(myOrder);
  }

  const doTheOtherThing = () => {
    console.log("did the OTHER thing !");
  }

  return (
    <div> 
      <button onClick={doTheThing}>Do the thing</button>


      <h1>Nouvelle commande</h1>
      <br />
      <br />
      <h2>Votre commande : </h2>
        <ul>
          {myOrder.map((article, index) => {
            return(
              <li key={index}> 1 {article.nom} : {article.prixUnitaire}€ <button onClick={() => removeFromOrder(index)}>Retirer de la commande</button>
              </li>
            )
          })}
          <h4>Montant total : {totalAmount} €</h4>
        </ul>

        <hr />
        <h3>Le filtre ici</h3>
        <ListeArticles 
          articles={articleListResult} 
          apiSearchResponse={apiSearchResponse} 
          displayAddToOrderButtonChild={true} 
          displayDetailsButtonChild={false}
          addToOrderChild={addToOrder}/>
        {/* Ce composant appelle lui même le composant Article. L'indication "Child" sur un nom de props indique que cet élément est réceptionné par le composant Article, enfant du composant ListeArticle */}
    </div>
  )
}
