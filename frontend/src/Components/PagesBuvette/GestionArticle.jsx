import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListeArticles from '../Utility/ListeArticles'
import { SessionContext } from '../../Contexts/SessionContext';

export default function ModifierArticle() {
    
//------------------------------------------------------------------------- INITIALISATION

    const {activeSession, isUserTokenExpired}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

    const [articleListResult, setArticleListResult] = useState([]);

//------------------------------------------------------------------------- USE EFFECT

    useEffect(() => {
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
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });    
      return () => {
        //
      }
    }, [])  

//------------------------------------------------------------------------- METHODES D'AFFICHAGE

//------------------------------------------------------------------------- METHODES DE PRÉPARATON DE REQUÊTE

//------------------------------------------------------------------------- METHODES DE TRAITEMENT et REQUÊTES

//------------------------------------------------------------------------- AFFICHAGE

  return (
    <div>
        <h3>
            Rechercher des articles
        </h3>
        <ListeArticles articles={articleListResult} />
    </div>
  )
}
