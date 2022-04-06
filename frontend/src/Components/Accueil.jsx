import React, { useState } from 'react'
import { useContext } from 'react';
import { SessionContext } from '../Contexts/SessionContext';

export default function Accueil() {

    const {activeSession}= useContext(SessionContext); 

  return (
    <div>
        {activeSession ? 
          <h1>Bonjour {activeSession.userInfo.nom} {activeSession.userInfo.prenom}</h1> 
          : <div></div>}
    </div>
  )
}
