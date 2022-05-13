import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../Contexts/SessionContext';
import DoTheThings from './Utility/DoTheThings';
import "../Styles/AppStyle.css";

export default function Connexion() {

//------------------------------------------------------------------------- INITIALISATION

    //Récupérer GetLocalStorage pour empêcher erreur en cas de localStorage vide
    //↑ Après s'être déconnecté

    const {activeSession, setActiveSession, fullUserList}= useContext(SessionContext);
    
    const myAppNavigator = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginApiResponse, setLoginApiResponse] = useState("");


//------------------------------------------------------------------------- METHODES DE TRAITEMENT

    const displayConnexionStatus = () => {
        try {
            return activeSession.userConnexionStatus;
        } catch (error) {
            return "nothing somehow";
        }
    }

    const apiLogin = (formEvent) => {
        formEvent.preventDefault();

        setActiveSession((prevState) => ({
            ...prevState, userConnexionStatus : "Connexion en cours..."
        }))

        fetch("/api/users/login",{
            method: "POST",
            headers:{"Content-type" : "application/json"},
            body: JSON.stringify({email, password})
        })
        .then((res) => res.json())
        .then((data) => {
            
            console.log("API response ↓");
            console.log(data.message);
            let thatNewSession;

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
                    case "Admin":
                    case "Double gérant":
                        myAppNavigator("/main");
                        break;
                    case "Gerant Buvette":
                        myAppNavigator("/manage/buvette");
                        break;
                    case "Gerant Matériel":
                        myAppNavigator("/manage/materiel");
                        break;
                    case "Aucun":
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
            }), setLoginApiResponse(data.message));
        })
        .catch((err) => {console.log(err)})

    }

//------------------------------------------------------------------------- AFFICHAGE

    
    const showUserList = () => {
        console.log();
    }

    return (
        <div className='BoxSimple'>
            <h1 className='PageName'>Connexion</h1>
            <form className='FormulaireSimple' onSubmit={apiLogin}>
                <div className='VerticalLabel'>
                    Adresse e-mail :
                </div>
                <input className='LargeInput' type="email" value={email} placeholder='Adresse e-mail' 
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}/>
                

                <div className='VerticalLabel'>
                    Mot de passe :
                </div>
                <input className='LargeInput' type="password" value={password} placeholder='Mot de passe' 
                onChange={(inputEvent) => setPassword(inputEvent.target.value)}/>

                <br />
                <button className='MainButton'>Connexion</button>
            
                {/*loginApiResponse*/}
                <div className='APIResponse'>
                    {displayConnexionStatus()}
                </div>
                {/*getLocalStorage("currentSession").userConnexionStatus*/}
            </form>


        </div>
    )
    
}
