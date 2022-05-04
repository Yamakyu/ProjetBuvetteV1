import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../Contexts/SessionContext';

export default function Accueil() {


  const myAppNavigator = useNavigate();

  const {activeSession, fullUserList, setFullUserList, isUserTokenExpired}= useContext(SessionContext); 

  useEffect(() => {
    fetch("/api/init/").then(res => res.json).then(data => console.log(data.message)).catch(error => console.log(error));

    if (fullUserList.length === 0){
      console.log("Setting the full list of users");
        fetch("/api/users/search/all",{
          method: "POST",
          headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
          body: JSON.stringify(
          {
            isInactiveAccountsIncluded: true,
          })
        })
        .then((res) => res.json())
        .then((data) => {
          console.log("API response ↓");
          console.log(data.message);

          if (isUserTokenExpired(data)){
            myAppNavigator("/login");
          }
          if (data.resultArray.length !== 0){
            setFullUserList(data.resultArray);
            console.log("La liste des utilisateurs a été mise à jour en arrière plan");
          }
        })
        .catch((err) => {
          console.log(err.message);
          console.log(err);
        });


    }
  
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
