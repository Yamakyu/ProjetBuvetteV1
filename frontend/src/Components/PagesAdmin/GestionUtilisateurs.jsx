import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import { useNavigate } from 'react-router-dom';



export default function GestionUtilisateurs() {
    const {activeSession, setActiveSession, setUserWorkedOn}= useContext(SessionContext);
    const myAppNavigator = useNavigate();


    useEffect(() => {
      setUserWorkedOn({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"Aucun"
    })      
    /* ↑ Afin de parer à l'éventualité où l'utilisateur revient de la page d'édition/suppression utilisateur, on reset
    userWorkedOn, ce qui empêchera d'afficher les informations la prochaine fois que l'utilisateur décide d'ajouter un 
    nouvel utilisateur. Ainsi, la formulaire d'ajout ne sera pas pré-rempli avec des informations d'un utilisateur existant*/
    
      return () => {}
    }, [])
    



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
