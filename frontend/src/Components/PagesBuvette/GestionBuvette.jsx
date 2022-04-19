import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import { useNavigate } from 'react-router-dom';


export default function GestionBuvette() {

  const {activeSession, setActiveSession}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

    const goToAddArticle = () =>
    {
        myAppNavigator("/manage/buvette/add");
    }

    const goToEditArticle = () =>
    {
        myAppNavigator("/manage/buvette/edit");
    }

  return (
    <div>
        <h1>Super page gestion de buvette</h1>
        <br/>
        <hr/>
        <button onClick={goToAddArticle}> Ajouter un utilisateur </button>
        <button onClick={goToEditArticle}> Bouton inactif </button>
    </div>
  )
}
