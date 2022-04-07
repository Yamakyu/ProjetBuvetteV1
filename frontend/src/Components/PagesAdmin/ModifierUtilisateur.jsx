import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';


export default function ModifierUtilisateur() {
    const {activeSession}= useContext(SessionContext);

    const [isDoubleChecking, setIsDoubleChecking] = useState(false);
    const [confirmButton, setConfirmButton] = useState();
    const [warning, setWarning] = useState("");
    const [warningUserDelete, setWarningUserDelete] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [userListResult, setUserListResult] = useState([])
    const [userWorkedOn, setUserWorkedOn] = useState({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"none"
    })

    //Au chargement de la page
    useEffect(() => {
         
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
                console.log(data.message);
                console.log(data.resultArray);
    
                //setApiResponse(data.message);
                setUserListResult(data.resultArray);
            })
            .catch((err) => {
                console.log(err.message);
                console.log(err);
            });

      return () => {
        //cleanup
      }
    }, []);

    //Dans la BdD les droits sont des booléens, on parse ceci.
    const parseUserRights = (thatUser) => {
        if (thatUser.isAdmin){
            return "Admin";
        }else if (thatUser.isGerantBuvette && thatUser.isGerantMateriel){
            return "Double gérant";
        }else if (!thatUser.isGerantBuvette && thatUser.isGerantMateriel) {
            return "Aucun";
        }else {
            return thatUser.isGerantBuvette 
            ? "Gerant Buvette"
            : "Gerant Matériel"
        };
    }
    
    //https://stackoverflow.com/questions/57581147/how-to-display-objects-keys-and-values-in-react-component
    const displayInputedUser = () => {
        return(
            <ul>
                {Object.entries(userWorkedOn).map(([objectKey, value]) =>
                //Cette expression conditionelle permet de masquer les booléens (isAdmin, etc) et le mot de passe
                objectKey.startsWith("is") || objectKey === "password"
                ? ""
                : <li key={objectKey}> {objectKey} : {value} </li>
                )}
            </ul>
        );
    }
    
    const disableUser = (userSelected) => {

        //REPRENDRE ICI
        setWarningUserDelete("Vous allez supprimer cet utilisateur")
    }

    const apiAddUser = async () => {
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
            console.log(data.message);
            console.log(data.addedUser);

            resetWarning();
            setApiResponse(data.message);
        })
        .catch((err) => console.log(err));
    }

    const resetWarning = () => {
        setWarning("");
        setConfirmButton("");
        setIsDoubleChecking(false);
    }

    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        console.log(userWorkedOn);

        setWarning("Résumé des modification : ↓");
        setConfirmButton(<button onClick={apiAddUser}>Confirmer</button>);
        setIsDoubleChecking(true);
    }


  return (
    <div>
        <br/>
        <h1>MODIFIER OU SUPPRIMER UN UTILISATEUR</h1>
        <br/>

        <UserForm 
            formHandler={submitForm}
            user={userWorkedOn} 
            setUser={setUserWorkedOn} 
            resetWarning={resetWarning}
            /*
            doubleCheck={isDoubleChecking} 
            setDoubleChecking={setIsDoubleChecking} 
            confirmButton={confirmButton}
            setConfirmButton={setConfirmButton}*/
            >    
        </UserForm>

        <br/>
        {confirmButton}
        {warning}
        <br/>
        {isDoubleChecking ? displayInputedUser() : ""}

        {/*Par défaut on affiche "liste utilisateurs, mais pour quand on fait des recherches, on va plutôt
        afficher "Résultats de la recherche", qui est donné en réponse de l'API Fetch.
        cf setApiResponse() */}
        {apiResponse || "Liste des utilisateurs :"}

        <br/>

        <ul>
        
                {Object.entries(userListResult).map(([objectKey, user]) =>
                {
                    return(
                        <li key={objectKey}> {user.nom} {user.prenom} // {user.email} // Droits : {parseUserRights(user)} {!user.isActiveAccount ? " ----- <COMPTE INACTIF>" : ""} 
                        <button onClick={disableUser(user)}>Supprimer cet utilisateur</button>
                        </li> 
                    )}
                )}
        </ul>

    </div>


  )
}
