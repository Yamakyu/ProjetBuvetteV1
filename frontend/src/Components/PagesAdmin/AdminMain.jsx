import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext'

export default function AdminMain() {

  const {activeSession, setActiveSession}= useContext(SessionContext);
  const myAppNavigator = useNavigate();


  return (
    <div>
      <h1>Super page admin</h1>

      <button onClick={() => myAppNavigator("/manage/users")}>Gestion des utiilisateurs</button>
      <button onClick={() => myAppNavigator("/manage/buvette")}>Gestion de la buvette</button>
      <button onClick={() => myAppNavigator("/manage/materiel")}>Gestion du materiel</button>

    </div>
  )
}
