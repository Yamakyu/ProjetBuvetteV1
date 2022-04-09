import React, { useContext, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';


export default function AjouterUtilisateur() {

//------------------------------------------------------------------------- INITIALISATION

    const {activeSession}= useContext(SessionContext);

    const [isDoubleChecking, setIsDoubleChecking] = useState(false)
    const [confirmButton, setConfirmButton] = useState();
    const [warning, setWarning] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [userWorkedOn, setUserWorkedOn] = useState({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"none"
    })

//------------------------------------------------------------------------- METHODES D'AFFICHAGE
    
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
    
    const resetWarning = () => {
        setWarning("");
        setConfirmButton("");
        setIsDoubleChecking(false);
    }

    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        console.log(userWorkedOn);

        setWarning("Cet utilisateur sera ajouté à la base de données : ");
        setConfirmButton(<button onClick={apiAddUser}>Confirmer</button>);
        setIsDoubleChecking(true);
        setApiResponse("");
    }

//------------------------------------------------------------------------- METHODES DE TRAITEMENT

    const apiAddUser = async () => {

        setApiResponse("Requête envoyée. L'opération peut prendre quelques secondes. En attente de la réponse du serveur... ");
        setConfirmButton("");

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
            console.log(data.addedUser);

            resetWarning();
            setApiResponse(data.message);
            
        })
        .catch((err) => console.log(err));


    }

//------------------------------------------------------------------------- AFFICHAGE

  return (
    <div>
        <br/>
        <h1>AJOUTER UN UTILISATEUR</h1>
        <br/>

        <UserForm 
            formHandler={submitForm}
            user={userWorkedOn} 
            setUser={setUserWorkedOn} 
            resetWarning={resetWarning} 
            editPassword={true}>    
        </UserForm>

        <br/>
        
        {warning}
        <br/>
        {isDoubleChecking ? displayInputedUser() : ""}
        <br/>
        {confirmButton || " ---- bouton de confirmation"}
        <br/>
        {apiResponse || " ---- réponse API"}
    </div>


  )
}
