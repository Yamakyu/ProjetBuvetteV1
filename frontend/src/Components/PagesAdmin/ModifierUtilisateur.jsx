import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';
import { useNavigate } from 'react-router-dom';



export default function ModifierUtilisateur() {

//------------------------------------------------------------------------- INITIALISATION

    const {activeSession, setActiveSession}= useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [isDoubleChecking, setIsDoubleChecking] = useState(false);
    const [confirmButton, setConfirmButton] = useState();
    const [warning, setWarning] = useState("");
    const [warningUserDelete, setWarningUserDelete] = useState("");
    const [apiSearchResponse, setApiSearchResponse] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [userListResult, setUserListResult] = useState([]);
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [listUserDisplay, setListUserDisplay] = useState("");
    const [userWorkedOn, setUserWorkedOn] = useState({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"none"
    })

//------------------------------------------------------------------------- USE EFFECT

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

                if (data.needLogout || !data.resultArray){
                    setActiveSession(() => localStorage.setItem('currentSession', null));
                    setActiveSession(prevState => ({
                        ...prevState,
                        userConnexionStatus:data.message
                    }));

                    console.log("statut de ActiveSession :");
                    console.log(activeSession);

                    myAppNavigator("/login");
                }
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


    useEffect(() => {
        refreshDisplayUserList();
        console.log(userWorkedOn);
    
      return () => {
        //Cleanup
      }
    }, [userListResult])
    
//------------------------------------------------------------------------- METHODES D'AFFICHAGE

    //Dans la BdD les droits sont des booléens, on parse ceci.
    const parseUserRights = (thatUser) => {
        if (thatUser.isAdmin){
            return "Admin";
        }else if (thatUser.isGerantBuvette && thatUser.isGerantMateriel){
            return "Double gérant";
        }else if (!thatUser.isGerantBuvette && !thatUser.isGerantMateriel) {
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
                //Cette expression conditionelle permet de masquer les booléens (isAdmin, etc), le mot de passe et les dates de création/update
                objectKey.startsWith("is") || objectKey === "password" || objectKey.startsWith("crea") || objectKey.startsWith("upda")
                ? ""
                : <li key={objectKey}> {objectKey} : {value} </li>
                )}
            </ul>
        );
    }

    const refreshDisplayUserList = () =>{
        console.log(userListResult);
        setListUserDisplay(
            <ul>
                {Object.entries(userListResult).map(([objectKey, user]) =>
                {
                    return(
                        <li key={objectKey}> {user.nom} {user.prenom} // {user.email} // Droits : {parseUserRights(user)} {user.isActiveAccount ? "" : " ----- <COMPTE INACTIF>"} 
                        {<button onClick={() => prepareDisableUser(user)}>Supprimer cet utilisateur</button>}
                        </li> 
                    )
                })
                }               
            </ul>
        )
    }

    const resetWarning = () => {
        setWarning("");
        setWarningUserDelete("");
        setConfirmButton("");
        setIsDoubleChecking(false);
    }

    const displayUserListInConsole = () => {
        console.log(userListResult);
        refreshDisplayUserList();
    }
    
    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        console.log(userWorkedOn);

        setWarning("Résumé des modification :");
        setWarningUserDelete("");
        setConfirmButton(<button>Confirmer la modification</button>);
        setIsDoubleChecking(true);
    }

//------------------------------------------------------------------------- METHODES DE TRAITEMENT

    const prepareDisableUser = (userSelected) => {
        setWarningUserDelete("Vous allez supprimer cet utilisateur");
        setIsDoubleChecking(true);

        setWarning("");
        setApiResponse("");
        
        
        setUserWorkedOn(userSelected);
        setUserWorkedOn(prevState => ({
            ...prevState,
            droits: parseUserRights(userSelected)
        }));

        setConfirmButton(<button onClick={() => apiDeactivateUser(userSelected)}>Confirmer la suppression</button>);
    }

    const apiDeactivateUser = async (thatUser) => {
        setApiResponse("Requête envoyée. L'opération peut prendre quelques secondes. En attente de la réponse du serveur... ");
        let userAfterEdit;

        await fetch(`/api/users/edit/${thatUser.id}`,{
            method: "PUT",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
                    isActiveAccount:false
                })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.updatedUser);

            resetWarning();
            setApiResponse(data.message);

            userAfterEdit = data.updatedUser;
            setUserWorkedOn(userAfterEdit);
            
        })
        .catch((err) => console.log(err));
        
        console.log(userWorkedOn);
        console.log(userAfterEdit);

        setUserListResult(
            [
                ...userListResult.filter((itemToRemove) => itemToRemove.id !== thatUser.id)
                , userAfterEdit
            ])
                        
        refreshDisplayUserList();
    }

//------------------------------------------------------------------------- AFFICHAGE


  return (
    <div>

        <button onClick={displayUserListInConsole}>test</button>

        <br/>
        <h1>MODIFIER OU SUPPRIMER UN UTILISATEUR</h1>
        <br/>

        <UserForm 
            formHandler={submitForm}
            user={userWorkedOn} 
            setUser={setUserWorkedOn} 
            resetWarning={resetWarning}
            editPassword={isEditingPassword}
            /*
            doubleCheck={isDoubleChecking} 
            setDoubleChecking={setIsDoubleChecking} 
            confirmButton={confirmButton}
            setConfirmButton={setConfirmButton}*/
            >    
        </UserForm>

        <br/>
        {warning}
        {warningUserDelete}
        <br/>
        {isDoubleChecking ? displayInputedUser() : ""}
        {confirmButton}
        {apiResponse}
        <br/>
        <br/>
        <br/>

        {/*Par défaut on affiche "liste utilisateurs, mais pour quand on fait des recherches, on va plutôt
        afficher "Résultats de la recherche", qui est donné en réponse de l'API Fetch.
        cf setApiSearchResponse() */}
        {apiSearchResponse || "Liste des utilisateurs :"}

        <br/>



        {listUserDisplay}

        <ul>
            {/*
            Object.entries(userListResult).map(([objectKey, user]) =>
            {
                return(
                    <li key={objectKey}> {user.nom} {user.prenom} // {user.email} // Droits : {parseUserRights(user)} {user.isActiveAccount ? "" : " ----- <COMPTE INACTIF>"} 
                    {<button onClick={() => prepareDisableUser(user)}>Supprimer cet utilisateur</button>}
                    </li> 
                )}
                )*/}
        </ul>

    </div>


  )
}
