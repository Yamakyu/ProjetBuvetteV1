import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { SessionContext } from '../Contexts/SessionContext';

export default function Accueil() {


  const {activeSession}= useContext(SessionContext); 

  useEffect(() => {
    fetch("/api/init/").then(res => res.json).then(data => console.log(data.message)).catch(error => console.log(error));
  
    return () => {}
  }, [])
    

  return (
    <div>
        {activeSession 
          ? <h1>Bonjour {activeSession.userInfo.nom} {activeSession.userInfo.prenom}</h1> 
          : ""}
    </div>
  )
}
