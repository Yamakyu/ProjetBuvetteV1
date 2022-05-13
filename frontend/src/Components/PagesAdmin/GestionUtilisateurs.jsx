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
        myAppNavigator("/manage/users/overview");
    }


  return (
    <div className='BoxSimple'>
      <div className='MenuButtonsBox'>
        <h1 className='PageName'>Gestion des utilisateurs</h1>
        <br/>
        <br/>

          <button className='MainButton' onClick={goToAddUser}> Ajouter un utilisateur (ou un client) </button>
          <button className='MainButton' onClick={goToEditUser}> Liste des utilisateurs</button>
      </div>
    </div>


  )
}
