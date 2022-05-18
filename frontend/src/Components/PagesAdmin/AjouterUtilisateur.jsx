import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';
import validator from 'validator';

export default function AjouterUtilisateur() {

//------------------------------------------------------------------------- INITIALISATION

    const {
        activeSession,
        setActiveSession,
        isUserTokenExpired,
        userWorkedOn,
        setUserWorkedOn 
    } = useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [checkEditUser, setCheckEditUser] = useState();
    // const [confirmButton, setConfirmButton] = useState();
    // const [warning, setWarning] = useState("");
    const [newUser, setNewUser] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        droits: "Aucun",
        isActiveAccount:true
    })
    const [apiResponse, setApiResponse] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

//------------------------------------------------------------------------- USE EFFECT

    //Quel que soit la page d'où on vient, on retire toujours le mot de passe
    useEffect(() => {


    setUserWorkedOn(() => ({
        ...userWorkedOn, 
        password : ""
    }))

    if (!isStringEmpty(userWorkedOn.nom)){
        setNewUser(() => ({
            ...userWorkedOn, 
            password : ""
        }))
    }
    

    return () => {}
    }, [])

//------------------------------------------------------------------------- METHODES DE TRAITEMENT


    const isStringEmpty = (thatString) => {
        if (thatString === null || thatString === undefined || thatString === "" || thatString.replace(/\s+/g, '') === ""){
            return true;
        } else {
            return false;
        }
    }

    //https://stackoverflow.com/questions/57581147/how-to-display-objects-keys-and-values-in-react-component
    /*
    const displayInputedUser = () => {
        return(
            <ul>
                {Object.entries(newUser).map(([objectKey, value]) =>
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
    */

    const resetWarning = () => {
        setApiResponse("");
        // setConfirmButton("");
        setCheckEditUser("");
    }

    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        console.log(newUser);

        
        if (isStringEmpty(newUser.nom) || isStringEmpty(newUser.prenom) || isStringEmpty(newUser.email)){
            return setApiResponse("Vous devez remplir tout les champs !");
        } else if (isStringEmpty(newUser.password)){
            setNewUser(() => ({
                ...newUser,
                password:""
            }))
            setPasswordConfirm("");
            return setApiResponse("Vous devez remplir tout les champs !");
        }

        if (!validator.isEmail(newUser.email)){
            return setApiResponse("Veuillez remplir une adresse e-mail valide !")
        }
        
        if (passwordConfirm !== newUser.password){
            setApiResponse("ATTENTION. La confirmation de mot de passe doit être identique au mot de passe entré !");
            setCheckEditUser("");
            // setConfirmButton("");
            //setApiResponse("");
        } else {
            setUserWorkedOn(newUser)
            myAppNavigator('/manage/users/verify')
            
            //setApiResponse("Cet utilisateur sera ajouté à la base de données : ");
            //setCheckEditUser(displayInputedUser());
            //setConfirmButton(<button onClick={apiAddUser}>Confirmer</button>);
            // setApiResponse("");
        }

    }

//------------------------------------------------------------------------- REQUÊTES

    

//------------------------------------------------------------------------- AFFICHAGE

  return (
    <div className='BoxSimple'>
        <br/>
        <h1 >Ajouter un utilisateur ou un client</h1>
        <br/>

        <UserForm 
            user={newUser}
            setUser={setNewUser}
            formHandler={submitForm}
            resetWarning={resetWarning} 
            editPassword={true}
            setPasswordConfirm={setPasswordConfirm}
            passwordConfirm={passwordConfirm}
            isAddNewUser={true} 
            >   
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
        <button className='SubButton' onClick={() => myAppNavigator("/manage/users/overview")}>Liste des utilisateurs</button>
    </div>


  )
}
