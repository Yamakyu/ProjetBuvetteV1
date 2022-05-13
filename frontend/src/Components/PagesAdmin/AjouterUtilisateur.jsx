import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';


export default function AjouterUtilisateur() {

//------------------------------------------------------------------------- INITIALISATION

    const {activeSession, setActiveSession, isUserTokenExpired, fullUserList}= useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [checkEditUser, setCheckEditUser] = useState();
    // const [confirmButton, setConfirmButton] = useState();
    // const [warning, setWarning] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [userWorkedOn, setUserWorkedOn] = useState({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"Aucun"
    });


    



//------------------------------------------------------------------------- METHODES DE TRAITEMENT


    const isStringEmpty = (thatString) => {
        if (thatString === null || thatString === undefined || thatString === "" || thatString.replace(/\s+/g, '') === ""){
            return true;
        } else {
            return false;
        }
    }

    //https://stackoverflow.com/questions/57581147/how-to-display-objects-keys-and-values-in-react-component
    const displayInputedUser = () => {
        return(
            <ul>
                {Object.entries(userWorkedOn).map(([objectKey, value]) =>
                //Cette expression conditionelle permet de masquer les booléens (isAdmin, etc) et le mot de passe
                objectKey.startsWith("is") || objectKey === "password"
                ? ""
                : <li key={objectKey}> <b>{objectKey}</b> : {value} </li>
                )}
                <br/>
                <button className='ConfirmButton' onClick={apiAddUser}>→ Ajouter l'utilisateur ←</button>
            </ul>
        );
    }
    
    const resetWarning = () => {
        setApiResponse("");
        // setConfirmButton("");
        setCheckEditUser("");
    }

    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        console.log(userWorkedOn);

        if (isStringEmpty(userWorkedOn.nom) || isStringEmpty(userWorkedOn.prenom) || isStringEmpty(userWorkedOn.email)){
            return setApiResponse("Vous devez remplir tout les champs !");
        }

        if (passwordConfirm !== userWorkedOn.password){
            setApiResponse("ATTENTION. La confirmation de mot de passe doit être identique au mot de passe entré !");
            setCheckEditUser("");
            // setConfirmButton("");
            //setApiResponse("");
        } else {
            setApiResponse("Cet utilisateur sera ajouté à la base de données : ");
            //setConfirmButton(<button onClick={apiAddUser}>Confirmer</button>);
            setCheckEditUser(displayInputedUser());
            // setApiResponse("");
        }

    }

//------------------------------------------------------------------------- REQUÊTES

    const apiAddUser = async () => {

        if (activeSession) {

            setApiResponse("Requête envoyée. L'opération peut prendre quelques secondes. En attente de la réponse du serveur... ");
            //setConfirmButton("");
    
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
                setPasswordConfirm("");

                if (data.success){
                    setUserWorkedOn({
                        nom:"",
                        prenom:"",
                        email:"",
                        password:"",
                        droits:"Aucun"
                    })
                }else {
                    setUserWorkedOn(() => ({
                        ...userWorkedOn, 
                        email: "",
                    }))
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

//------------------------------------------------------------------------- AFFICHAGE

  return (
    <div className='BoxSimple'>
        <br/>
        <h1 >Ajouter un utilisateur ou un client</h1>
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
        <div className='APIResponse'>
            {apiResponse || ""}
        </div>
        <br/>
        
        {/*warning || ""*/}
        <br/>
        {checkEditUser || ""}
        {/*confirmButton || ""*/}
        <br/>


        <br/>
        <button className='SubButton' onClick={() => myAppNavigator("/manage/users/edit")}>Liste des utilisateurs</button>
    </div>


  )
}
