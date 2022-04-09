import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../Contexts/SessionContext';


export default function Connexion() {

//------------------------------------------------------------------------- INITIALISATION

    //Récupérer GetLocalStorage pour empêcher erreur en cas de localStorage vide
    //↑ Après s'être déconnecté

    const {activeSession, setActiveSession, getLocalStorage}= useContext(SessionContext);
    
    const myAppNavigator = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

//------------------------------------------------------------------------- USE EFFECT


//------------------------------------------------------------------------- METHODES DE TRAITEMENT

    
    const apiLogin = (formEvent) => {
        formEvent.preventDefault();

        //Envoi à notre API back end
        fetch("/api/users/login",{
            method: "POST",
            headers:{"Content-type" : "application/json"},
            body: JSON.stringify({email, password})
        })
        .then((res) => res.json())
        .then((data) => {
            
            let thatNewSession;
            console.log("API response ↓");
            console.log(data.message);

            if(data.user){
                console.log(data.user);            
                console.log(`Le token (extreme) : ${data.newToken}`);
                
                thatNewSession = {
                    userInfo: data.user,
                    userToken: data.newToken,
                    userConnexionStatus:"Vous êtes connecté"
                };

                localStorage.setItem('currentSession', JSON.stringify(thatNewSession));
                setActiveSession(thatNewSession);
    
                switch (thatNewSession.userInfo.droits) {
                    case "admin":
                        myAppNavigator("/admin");
                        break;
                    case "both":
                        myAppNavigator("/manage");
                        break;
                    case "buvette":
                        myAppNavigator("/manage/buvette");
                        break;
                    case "materiel":
                        myAppNavigator("/manage/materiel");
                        break;
                    case "none":
                    default:
                        myAppNavigator("/");
                        break;
                }

            }else if (data.error){
                console.log(data.error);
            }
                setActiveSession(prevState => ({
                    ...prevState,
                    userConnexionStatus:data.message
                }));
        })
        .catch((err) => console.log(err));

    }

//------------------------------------------------------------------------- AFFICHAGE


    return (
        <div>

            <form onSubmit={apiLogin}>
                <input type="email" value={email} placeholder='email' 
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}/>
                
                <input type="password" value={password} placeholder='password' 
                onChange={(inputEvent) => setPassword(inputEvent.target.value)}/>
                <br />
                <br />

                <button>Connexion</button>
            </form>

            {getLocalStorage("currentSession").userConnexionStatus}

        </div>
    )
    
}
