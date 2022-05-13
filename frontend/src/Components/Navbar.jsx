import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
//import { useContext } from 'react/cjs/react.development';
import { useContext } from 'react';
import { SessionContext } from '../Contexts/SessionContext';

export default function Navbar() { 

    const myAppNavigator = useNavigate() ;

    const [confirmDropDatabaseBtn, setConfirmDropDatabaseBtn] = useState("")
    const [cancelDropDatabaseBtn, setCancelDropDatabaseBtn] = useState("")

    const {activeSession, setActiveSession, getLocalStorage, setCurrentOrder}= useContext(SessionContext); 

    const userLogout = () => {
        //setActiveSession(() => localStorage.removeItem('currentSession'));

        localStorage.removeItem("currentSession")

        setActiveSession(() => ({
          ...getLocalStorage("currentSession"),
          userConnexionStatus: "Veuillez vous connecter pour accéeder aux fonctionnalités"
        }));

        setCurrentOrder([]);

        myAppNavigator("/login");
    }

    let baseNavbar = () => {
        return(
            <div>
                {activeSession === undefined ? "" : <button onClick={displayActiveSession}>Bon c'est quoi l'active session là</button>}
                {activeSession.userInfo.droits === "Admin" ? <button onClick={prepareDropDatabase}>Drop la BdD</button> : ""}
                {confirmDropDatabaseBtn}
                {cancelDropDatabaseBtn}
                <a href='https://trello.com/b/Op3lCEVw/stage-doranco-application-gestion-buvette-stock'> - TRELLO - </a>
            </div>
        )
    }

    let generateNavbar = () =>{
        try{
            if(window.location.pathname === "/login"){
                return;
            }
            if (activeSession.userInfo.droits === undefined || !activeSession){
                return(
                    <nav>
                        <Link to="/login"> [ Connexion ] </Link>
                    </nav>
                )
            }
            else{
                switch (activeSession.userInfo.droits) {
                    case "Admin":
                        return(
                            <nav className='Navbar'>
                                <Link className='NavbarButton' to="/main">Menu principal</Link>
                                <Link className='LogoutButton' to="/" onClick={userLogout}>Deconnexion</Link>
                            </nav>
                        )
                    case "Double gérant":
                        return(
                            <nav className='Navbar'>
                                <Link className='NavbarButton' to="/manage">Menu principal</Link>
                                <Link className='LogoutButton' to="/" onClick={userLogout}>Deconnexion</Link>
                            </nav>
                        )
                    case "Gerant Buvette":
                        return(
                            <nav className='Navbar'>
                                <Link className='NavbarButton' to="/manage/buvette">Gestion buvette</Link>
                                <Link className='LogoutButton' to="/" onClick={userLogout}>Deconnexion</Link>
                            </nav>
                        )
                    case "Gerant Matériel":
                        return(
                            <nav className='Navbar'>
                                <Link className='NavbarButton' to="/manage/materiel">Gestion Matériel</Link>
                                <Link className='LogoutButton' to="/" onClick={userLogout}>Deconnexion</Link>
                            </nav>
                        )                
                    case"Aucun":
                    default:
                        return(
                            <nav className='Navbar'>
                                <Link className='NavbarButton' to="/Accueil">Accueil</Link>
                                <Link className='LogoutButton' to="/" onClick={userLogout}>Deconnexion</Link>
                            </nav>
                        )
                }
            }
        }
        catch(error){
            return(
                <nav className='Navbar'>
                    <Link to="/">Accueil</Link>
                    <Link to="/login">Connexion</Link>
                </nav>
            )
        }
    }

    const prepareDropDatabase = () => {
        setConfirmDropDatabaseBtn(<button onClick={cancelDropDatabase}>ABORT ABORT ABORT</button>);
        setCancelDropDatabaseBtn(<button onClick={dropDatabase}>Do it</button>);
    }

    const cancelDropDatabase = () => {
        setConfirmDropDatabaseBtn("");
        setCancelDropDatabaseBtn("");
    }

    const putBackAdmins = () => {
        try{
            fetch("/api/init/").then(res => res.json).then(data => console.log(data.message));
            setCancelDropDatabaseBtn("");
            userLogout();
        }catch (error){
            console.log(error);
        }

    }

    const dropDatabase = () => {

        setConfirmDropDatabaseBtn("");

        fetch(`/api/reset`,{
            method: "GET",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);           
            if (!data.needLogout) {
                setCancelDropDatabaseBtn(<button onClick={putBackAdmins}>Remettre admin</button>);
            }
        })
        .catch((err) => console.log(err));
        
        setCancelDropDatabaseBtn("");

    }

    const displayActiveSession = () => {
        try {
            console.log(activeSession);
        } catch (error) {
            console.log("Pas d'activeSession");
        }
    }



    return (

        <div>
            {generateNavbar()}
            {/*baseNavbar()*/}
            
            <hr className='NavbarSeparator'/>
        </div>
    )
}
