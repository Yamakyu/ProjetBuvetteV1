import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListeArticles from '../Utility/ListeArticles'
import { SessionContext } from '../../Contexts/SessionContext';

export default function ModifierArticle() {
    
//------------------------------------------------------------------------- INITIALISATION

    const {activeSession, isUserTokenExpired}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

    const [articleListResult, setArticleListResult] = useState([]);
    const [searchTool, setSearchTool] = useState();
    const [apiSearchResponse, setApiSearchResponse] = useState("");
    const [searchWarning, setSearchWarning] = useState("");
    const [isListFiltered, setIsListFiltered] = useState(false);
    const [cancelSearchButton, setCancelSearchButton] = useState();

//------------------------------------------------------------------------- USE EFFECT

    useEffect(() => {
        
        apiGetAllArticles();
        setCancelSearchButton(<button onClick={apiGetAllArticles}>Annuler la recherche et afficher la liste de tout les articles</button>);
        //Le bouton est set dans useEffect car "apiGetAllArticles" n'est déclaré qu'en fin de script, ce qui oblige à assigner le bouton en fin de script.

      return () => {
        //
      }
    }, [])  

//------------------------------------------------------------------------- METHODES D'AFFICHAGE

//------------------------------------------------------------------------- METHODES DE PRÉPARATON DE REQUÊTE

    const prepareSearchArticleByName = () => {
        let nameToLookFor;
        let checkUnavailableArticles;
        setSearchTool(
            <div>
                Entrez votre recherche : 

                <input
                placeholder="nom de l'article"
                value={nameToLookFor}
                type="text"
                onChange={(e) => nameToLookFor = e.target.value}
                name="searchName"
                />
                <br/>
            
                Inclure les articles non disponibles ?
                <input type="checkbox" defaultChecked={false} value={checkUnavailableArticles} onChange={() => checkUnavailableArticles = !checkUnavailableArticles}/>
                <br/>
                <button onClick={() => apiSearchArticlesByName(nameToLookFor, checkUnavailableArticles)}>Lancer la recherche</button>
                
            </div>
        );
    }

    const prepareSearchArticleByCategory = () => {
        let categoryToLookFor;
        let checkUnavailableArticles;

        setSearchTool(
            <div>
               <label>
                    Rechercher un article de quelle catégorie ? 
                    <select onChange={(e) => categoryToLookFor = e.target.value}>
                        <option value=""></option>
                        <option value="snack">Snack</option>
                        <option value="friandise">friandise</option>
                        <option value="boisson chaude">Boisson chaude</option>
                        <option value="boisson fraiche">Boisson fraîche</option>
                    </select>
                </label>
                <br/>
            
                Inclure les articles non disponibles ? 
                <input type="checkbox" defaultChecked={false} value={checkUnavailableArticles} onChange={() => checkUnavailableArticles = !checkUnavailableArticles}/>
                <br/>
                <button onClick={() => apiSearchArticlesByCategory(categoryToLookFor, checkUnavailableArticles)}>Lancer la recherche</button>
            </div>
        );
    }

    const isFilterValid = (filter) => {
        if (filter === null || filter === undefined || filter === "" || filter.replace(/\s+/g, '') === ""){
            setSearchWarning(" Vous ne pouvez pas faire de recherche vide")
            return false;
        }else{
            setSearchWarning("")
            return true;
        }
    }

//------------------------------------------------------------------------- METHODES DE TRAITEMENT et REQUÊTES

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
                    isOnlyAvailableArticles: null,
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

  return (
    <div>
        <br/>
        <h3>
            Filtrer les articles
            <br/>
            <button onClick={prepareSearchArticleByName}>Rechercher des article par leur nom</button>
            <button onClick={prepareSearchArticleByCategory}>Rechercher des article par catégorie</button>
        </h3>
        {searchTool}
        { searchWarning }
        { isListFiltered 
            ? cancelSearchButton
            : "" }
        <br/>
        <br/>
        <hr color='#adadad'/>
        <ListeArticles articles={articleListResult} apiSearchResponse={apiSearchResponse} />
    </div>
  )
}