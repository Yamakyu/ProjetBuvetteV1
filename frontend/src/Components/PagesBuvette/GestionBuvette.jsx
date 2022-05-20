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

  const goToNewOrder = () => {
    myAppNavigator("/manage/buvette/orders/new")
  }
  
  const goToOrderHistory = () => {
    myAppNavigator("/manage/buvette/invoices")
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
    <div className='BoxSimple'>
      <div className='MenuButtonsBox'>
        <h1 className='PageName'>Super page gestion de buvette</h1>

        <button className='ActionButton' onClick={goToNewOrder}> NOUVELLE COMMANDE </button>
        <button className='MainButton' onClick={gotToArticleOverview}> Liste des articles </button>
        <button className='MainButton' onClick={goToAddArticle}> Ajouter un nouvel article </button>
        <button className='MainButton' onClick={goToOrderHistory}> Historique des commandes</button>
        <button className='SubButton' onClick={initSomeArticles}> Initialiser des articles </button>

        <br/>
        {apiResponse}
      </div>
    </div>

  )
}
