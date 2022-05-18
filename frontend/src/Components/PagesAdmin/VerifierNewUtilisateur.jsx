import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import Utilisateur from '../Utility/Utilisateur'
import DoTheThings from '../Utility/DoTheThings'

export default function VerifierNewUtilisateur() {
    const { 
        userWorkedOn,
        setUserWorkedOn,
        activeSession,
        setActiveSession,
        isUserTokenExpired 
    } = useContext(SessionContext);
    
    const [isUserAdded, setIsUserAdded] = useState(false);
    const [isEmailError, setIsEmailError] = useState(false);
    const [apiResponse, setApiResponse] = useState("");
    const myAppNavigator = useNavigate();


    useEffect(() => {
        const emptyUser = {
            nom: "",
            prenom: "",
            email: "",
            password: "",
            droits: "Aucun",
            isActiveAccount: true
        }


        console.log(userWorkedOn);

      if (JSON.stringify(userWorkedOn) === JSON.stringify(emptyUser)){
        myAppNavigator("/manage/users/add");
      }
    
      return () => {}
    }, [])
    

    const goBackToAddUser = () => {
        myAppNavigator("/manage/users/add");
    }

    const apiAddUser = async () => {

        if (activeSession) {

            setApiResponse("Requête envoyée. L'opération peut prendre quelques secondes. En attente de la réponse du serveur... ");
    
            //Envoi à notre API back end
            await fetch("/api/users/signup",{
                method: "POST",
                headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
                body: JSON.stringify(
                    {
                        nom: userWorkedOn.nom,
                        prenom:userWorkedOn.prenom,
                        email:userWorkedOn.email,
                        password:userWorkedOn.password,
                        isGerantBuvette:userWorkedOn.isGerantBuvette,
                        isGerantMateriel:userWorkedOn.isGerantMateriel,
                        isAdmin:userWorkedOn.isAdmin
                    })
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("API response ↓");
                console.log(data.message);

                if (isUserTokenExpired(data)){
                    myAppNavigator("/login");
                }

                console.log(data.addedUser);
    
                setApiResponse(data.message);

                //data.success est faux si un utilisateur avec la même adresse mail est trouvé.
                //En plus de cacher le mail, apiResponse affiche alors l'erreur.
                if (data.success){
                    setIsUserAdded(true);
                    setUserWorkedOn({
                        nom: "",
                        prenom: "",
                        email: "",
                        password: "",
                        droits: "Aucun",
                        isActiveAccount:true
                    }, console.log("userWorkedOn reset !"));
                    
                }else{
                    setUserWorkedOn(() => ({
                        ...userWorkedOn, 
                        email: "",
                    }));
                    setIsEmailError(true);
                }
            })
            .catch((err) => console.log(err));
        }else{
            setActiveSession({
                userConnexionStatus:"Accès réservé. Veuillez vous connecter."
            })
            myAppNavigator("/login");
        }
    }

    const printPassword = () => {
        console.log(userWorkedOn);
    }

  return (
    <div>
        <h1>Cet utilisateur sera enregistré</h1>

        <DoTheThings
            theThing = {printPassword}
        />

        <div className='BoxSimple'>

            <div className='APIResponse'>
                {apiResponse || ""}
            </div>

            {isUserAdded 
                ?<div>
                    <button className='SubButton' onClick={() => myAppNavigator("/manage/users/add")}>Ajouter un nouvel utilisateur (ou un client)</button>
                    <br />
                    <button className='SubButton' onClick={() => myAppNavigator("/manage/users/overview")} >Liste des utilisateurs</button>
                </div>
                :<Utilisateur
                user = {userWorkedOn}
                displayAddUserButton
                displayGoBackToAddUserButton
                disableAddUser = {isEmailError}
                backEndAPIRequest = {apiAddUser}
            />
            }

        </div>
    </div>
  )
}
