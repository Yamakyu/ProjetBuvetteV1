import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import { useNavigate } from 'react-router-dom';


export default function GestionBuvette() {

  const {activeSession, isUserTokenExpired}= useContext(SessionContext);
  const myAppNavigator = useNavigate();
  const [apiResponse, setApiResponse] = useState("");

  const goToAddArticle = () =>
  {
    myAppNavigator("/manage/buvette/articles/add");
  }

  const gotToArticleOverview = () =>
  {
    myAppNavigator("/manage/buvette/articles/overview");
  }

  const initSomeArticles = () =>
  {
    fetch("/api/articles/init",{
      method: "GET",
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
    })
    .catch((err) => {
        console.log(err.message);
        console.log(err);
    });    
  }

  return (
    <div>
        <h1>Super page gestion de buvette</h1>
        <br/>
        <hr/>
        <button onClick={goToAddArticle}> Ajouter un article </button>
        <button onClick={gotToArticleOverview}> Gestion des articles </button>
        <button onClick={initSomeArticles}> Initialiser des articles </button>

        <br/>
        {apiResponse}
    </div>
  )
}
