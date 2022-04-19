import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import { useNavigate } from 'react-router-dom';



export default function GestionUtilisateurs() {
    const {activeSession, setActiveSession}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

    const goToAddUser = () =>
    {
        myAppNavigator("/manage/users/add");
    }

    const goToEditUser = () =>
    {
        myAppNavigator("/manage/users/edit");
    }


  return (
    <div>
      <h1>Super page gestion d'utilisateur</h1>
      <br/>
      <br/>

        <button onClick={goToAddUser}> Ajouter un utilisateur </button>
        <button onClick={goToEditUser}> Modifier ou supprimer un utilisateur </button>
    </div>


  )
}
