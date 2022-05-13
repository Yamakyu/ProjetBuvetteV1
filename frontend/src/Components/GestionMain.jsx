import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../Contexts/SessionContext'

export default function GestionDouble() {

    const {activeSession, setActiveSession}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

  return (
    <div className='BoxSimple'>
      <div className='MenuButtonsBox'>
        <h1 className='PageName'>Accéder à : </h1>

        <button className='MainButton'
          hidden={!activeSession.userInfo.isAdmin} 
          onClick={() => myAppNavigator("/manage/users")}>
            Gestion des utiilisateurs
        </button>
        
        <button className='MainButton'
          hidden={!activeSession.userInfo.isAdmin && !activeSession.userInfo.isGerantMateriel}
          onClick={() => myAppNavigator("/manage/materiel")}>
            Gestion du materiel
        </button>
        
        <button className='MainButton'
          hidden={!activeSession.userInfo.isAdmin && !activeSession.userInfo.isGerantBuvette}
          onClick={() => myAppNavigator("/manage/buvette")}>
            Gestion de la buvette
        </button>
      </div>
    </div>
  )
}
