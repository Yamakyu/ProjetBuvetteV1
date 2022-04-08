import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';
import { useNavigate } from 'react-router-dom';



export default function ModifierUtilisateur() {
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
                console.log(data.resultArray);
    
                //setApiSearchResponse(data.message);
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
    

    const prepareDisableUser = (userSelected) => {
        setWarningUserDelete("Vous allez supprimer cet utilisateur");
        setIsDoubleChecking(true);

        setWarning("");
        
        setUserWorkedOn(userSelected);
        setUserWorkedOn(prevState => ({
            ...prevState,
            droits: parseUserRights(userSelected)
        }));

        setConfirmButton(<button onClick={() => apiDeactivateUser(userSelected)}>Confirmer la suppression</button>);
    }

    const apiDeactivateUser = async (thatUser) => {

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
            console.log(data.message);
            console.log(data.updatedUser);

            resetWarning();
            setApiSearchResponse(data.message);
            setUserWorkedOn(data.updatedUser);
        })
        .catch((err) => console.log(err));


        //Uncaught (in promise) TypeError: userListResult.filter is not a function :thonk:
        //↑ Erreur quand on essaie de supprimer un 2e utilisateur sans refresh.
        setUserListResult(userListResult.filter(
            (itemToRemove) => itemToRemove.id != thatUser.id
            ));
        setUserListResult(prevState => ({...prevState, userWorkedOn}));


    }

    const resetWarning = () => {
        setWarning("");
        setWarningUserDelete("");
        setConfirmButton("");
        setIsDoubleChecking(false);
    }

    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        console.log(userWorkedOn);

        setWarning("Résumé des modification :");
        setWarningUserDelete("");
        setConfirmButton(<button>Confirmer la modification</button>);
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

        <ul>
            {Object.entries(userListResult).map(([objectKey, user]) =>
            {
                return(
                    <li key={objectKey}> {user.nom} {user.prenom} // {user.email} // Droits : {parseUserRights(user)} {user.isActiveAccount ? "" : " ----- <COMPTE INACTIF>"} 
                    {<button onClick={() => prepareDisableUser(user)}>Supprimer cet utilisateur</button>}
                    </li> 
                )}
            )}
        </ul>

    </div>


  )
}
