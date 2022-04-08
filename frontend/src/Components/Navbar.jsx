import React from 'react'
import { Link, /*useNavigate*/ } from 'react-router-dom'
//import { useContext } from 'react/cjs/react.development';
import { useContext } from 'react';
import { SessionContext } from '../Contexts/SessionContext';

// Pour rappel, l'avantage d'utiliser Link au lieu de juste une liste d'ancres, c'est que Link ne refresh pas la page.

export default function Navbar() { 

    const {activeSession, setActiveSession}= useContext(SessionContext); 

    const userLogout = () => {
        setActiveSession(() => localStorage.setItem('currentSession', null));
    }

    let generateNavbar = () =>{

        try{
            if (activeSession.userInfo.droits === undefined || !activeSession){
                return(
                    <nav>
                        <Link to="/"> [ Accueil ] </Link>
                        <Link to="/login"> [ Connexion ] </Link>
                    </nav>
                )
            }
            else{
                switch (activeSession.userInfo.droits) {
                    case "admin":
                        return(
                            <nav>
                                <Link to="/admin"> [ Interface admin ] </Link>
                                <Link to="/manage/buvette"> [ Gestion buvette ] </Link>
                                <Link to="/manage/materiel "> [ Gestion materiel ] </Link>
                                <Link to="/manage/users "> [ Gestion utilisateurs ] </Link>
                                <Link to="/" onClick={userLogout}> [ Deconnexion ] </Link>
                            </nav>
                        )
                    case "both":
                        return(
                            <nav>
                                <Link to="/manage/buvette"> [ Gestion buvette ] </Link>
                                <Link to="/manage/materiel "> [ Gestion materiel ] </Link>
                                <Link to="/" onClick={userLogout}> [ Deconnexion ] </Link>
                            </nav>
                        )
                    case "buvette":
                        return(
                            <nav>
                                <Link to="/manage/buvette"> [ Gestion buvette ] </Link>
                                <Link to="/" onClick={userLogout}> [ Deconnexion ] </Link>
                            </nav>
                        )
                    case "materiel":
                        return(
                            <nav>
                                <Link to="/manage/materiel"> [ Gestion buvette ] </Link>
                                <Link to="/" onClick={userLogout}> [ Deconnexion ] </Link>
                            </nav>
                        )                
                    case"none":
                    default:
                        return(
                            <nav>
                                <Link to="/Accueil"> [ Accueil ] </Link>
                                <Link to="/" onClick={userLogout}> [ Deconnexion ] </Link>
                            </nav>
                        )
                }
            }
        }
        catch(error){
            return(
                <nav>
                    <Link to="/"> [ Accueil ] </Link>
                    <Link to="/login"> [ Connexion ] </Link>
                </nav>
            )
        }
    }


    return (

        <div>
            {generateNavbar()}
        </div>
    )
}
