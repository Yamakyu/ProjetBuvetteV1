import React, { useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'


export default function GestionUtilisateurs() {
    const [userWorkedOn, setUserWorkedOn] = useState({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"none"
    })
    const [confirmButton, setConfirmButton] = useState();
    const [warning, setWarning] = useState("");
    const [warningCreateAdmin, setWarningCreateAdmin] = useState("");
    const [isDoubleChecking, setIsDoubleChecking] = useState(false)

    let inputedUser;
    let formulaireAdmin;

    const resetEdits = () =>{
        setUserWorkedOn({nom:"",
        prenom:"",
        login:"",
        password:"",
        droits:"none"})

        setWarning("");
        setConfirmButton("");
        setIsDoubleChecking(false);
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
    
    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        console.log(userWorkedOn);

        setWarning("Résumé des modification : ↓");
        setConfirmButton(<button onClick={sendRequest}>Confirmer</button>);

        setIsDoubleChecking(true);

        inputedUser = () =>{
            
        }
    }

    const sendRequest = () => {
        setWarning("");
        setConfirmButton("");

        setIsDoubleChecking(false);
    }


    //https://stackoverflow.com/questions/54150783/react-hooks--with-object 
    const handleInputs = inputEvent => {
        setWarning("");
        setConfirmButton("");

        setIsDoubleChecking(false);

        const { name, value } = inputEvent.target;

        setUserWorkedOn(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleInputSelect = inputEvent => {

        setWarning("");
        setConfirmButton("");

        setIsDoubleChecking(false);

        const pickedOption = inputEvent.target.value;

        switch (pickedOption) {
            case "buvette":
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isGerantMateriel: false,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "materiel":
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isGerantBuvette: false,
                    isGerantMateriel: true}));
                setWarningCreateAdmin("");
                break;
            case "both":
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isGerantMateriel: true,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "admin" :
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: true}));
                setWarningCreateAdmin("Vous vous apprêtez à créer un utilisateur avec les droits ADMINISTRATEUR.")
                break;
            case "none":
            default:
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    isGerantMateriel: false,
                    isGerantBuvette: false,
                    droits: pickedOption}));
                setWarningCreateAdmin("")
                break;
        }
    }



  return (
    <div>
        <br/>
        <form onSubmit={submitForm}>
            <input
                placeholder='nom'
                value={userWorkedOn.nom}
                type="text"
                onChange={handleInputs}
                name="nom"
            />
            <input
                placeholder='prenom'
                value={userWorkedOn.prenom}
                type="text"
                onChange={handleInputs}
                name="prenom"
            />
            <input
                placeholder='email'
                value={userWorkedOn.email}
                type="text"
                onChange={handleInputs}
                name="email"
            />
            <input
                placeholder='prenom'
                value={userWorkedOn.password}
                type="password"
                onChange={handleInputs}
                name="password"
            />
            <label>
                Droits de gestion : 
                <select onChange={handleInputSelect} value={userWorkedOn.droits}>
                    <option value="none">Aucun</option>
                    <option value="buvette">Gérant de buvette</option>
                    <option value="materiel">Gérant matériel</option>
                    <option value="both">Gérant buvette + matériel</option>
                    <option value="admin">Administrateur</option>
                </select>
            </label>
            <button>Valider</button>
        </form>
        <button onClick={resetEdits}>Effacer tout les changements</button>
        {warningCreateAdmin}
        <br/>
        {confirmButton}
        {warning}
        <br/>
        {isDoubleChecking ? displayInputedUser() : ""}
    </div>


  )
}
