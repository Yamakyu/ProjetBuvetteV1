import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../Contexts/SessionContext'

export default function GestionDouble() {

    const {setCurrentOrder, activeSession, setActiveSession, needOrderReset, setNeedOrderReset}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

    const [wipeButton, setWipeButton] = useState("");
    const [apiResponse, setApiResponse] = useState("");

    useEffect(() => {
      if (needOrderReset){
        setCurrentOrder([])
      }
    
      return () => {}
    }, [])
       
    const apiWipeDB = async () => {    
      setApiResponse("L'opération peut prendre quelques instants. Veuillez patienter... ");
      
      await fetch("/api/reset",{
        method: "GET",
        headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("API response ↓");
        console.log(data.message);
        setApiResponse(data.message);

        myAppNavigator("/login");
      })
      .catch((err) => console.log(err));
  }


  return (
    <div className='BoxSimple'>
      <div className='MenuButtonsBox'>
        <h1 className='PageName'>Accéder à : </h1>

        <button className='MainButton'
          hidden={!activeSession.userInfo.isAdmin && !activeSession.userInfo.isGerantBuvette}
          onClick={() => myAppNavigator("/manage/buvette")}>
            Gestion de la buvette
        </button>

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

        <button className='MiniCardCancelButton'
          hidden={!activeSession.userInfo.isAdmin && !activeSession.userInfo.isGerantMateriel}
          onClick={() => setWipeButton(<button onClick={apiWipeDB} className='MiniCardRedButton'>Confirmer ?</button>)}>
            Reset databse
        </button>

        {wipeButton}

        <div className='APIResponse'>{apiResponse}</div>
        
      </div>
    </div>
  )
}
