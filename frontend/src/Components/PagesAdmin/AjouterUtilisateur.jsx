import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';


export default function AjouterUtilisateur() {

//------------------------------------------------------------------------- INITIALISATION

    const {activeSession, setActiveSession, isUserTokenExpired}= useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [checkEditUser, setCheckEditUser] = useState();
    const [confirmButton, setConfirmButton] = useState();
    const [warning, setWarning] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [userWorkedOn, setUserWorkedOn] = useState({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"Aucun"
    });

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
        setCheckEditUser("");
    }

    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        console.log(userWorkedOn);

        if (passwordConfirm !== userWorkedOn.password){
            setWarning("ATTENTION. La confirmation de mot de passe doit être identique au mot de passe entré !");
            setCheckEditUser("");
            setConfirmButton("");
            setApiResponse("");
        } else {
            setWarning("Cet utilisateur sera ajouté à la base de données : ");
            setConfirmButton(<button onClick={apiAddUser}>Confirmer</button>);
            setCheckEditUser(displayInputedUser());
            setApiResponse("");
        }

    }

//------------------------------------------------------------------------- REQUÊTES

    const apiAddUser = async () => {

        if (activeSession) {

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

                if (isUserTokenExpired(data)){
                    myAppNavigator("/login");
                }

                console.log(data.addedUser);
    
                resetWarning();
                setApiResponse(data.message);
                setUserWorkedOn({
                    nom:"",
                    prenom:"",
                    email:"",
                    password:"",
                    droits:"Aucun"
                })
                setPasswordConfirm("");
                
            })
            .catch((err) => console.log(err));
    


        }else{
            setActiveSession({
                userConnexionStatus:"Accès réservé. Veuillez vous connecter."
            })
            myAppNavigator("/login");
        }



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
            editPassword={true}
            setPasswordConfirm={setPasswordConfirm}
            passwordConfirm={passwordConfirm}>    
        </UserForm>

        <br/>
        
        {warning || ""}
        <br/>
        {checkEditUser || ""}
        <br/>
        {confirmButton || ""}
        <br/>
        {apiResponse || ""}
    </div>


  )
}
