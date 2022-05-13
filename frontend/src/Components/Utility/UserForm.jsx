import React, { useContext, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext';

export default function UserForm(props) {

    const { userWorkedOn, setUserWorkedOn }= useContext(SessionContext);

    let user = props.user || userWorkedOn;
    let setUser = props.setUser || setUserWorkedOn;

    let validateForm = props.formHandler;
    let resetWarning = props.resetWarning;
    let refreshEditUser = props.refreshEditUserDisplay;
    //↓ Si on décide d'afficher le champ pour le mot de passe, ça fait true et true, et on l'affiche. Sinon false par défaut
    let displayPasswordField = props.editPassword && true;
    let passwordConfirm = props.passwordConfirm;
    let setPasswordConfirm = props.setPasswordConfirm;
    //↓ Pour désactiver les inputs (suppressions utilisateur). C'est actif par défaut (si on ne transmet pas le props, il est false, l'input est actif)
    let isInputDisabled = props.disableInput && true;
    let setIsInputDisabled = props.setDisableInput || (() => {});
    let isAddNewUser = props.isAddNewUser; 
    
    //↑ Si le props pour (dés)activer les input n'a pas été transmis, setIsInputEnabled est une fonction vide

    const [warningCreateAdmin, setWarningCreateAdmin] = useState("");

    const resetEdits = (inputEvent) =>{
        inputEvent.preventDefault();
        setUser({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"none"})

        resetWarning();
        setWarningCreateAdmin("");
    }  

        //https://stackoverflow.com/questions/54150783/react-hooks--with-object 
    const handleInputs = inputEvent => {
        resetWarning();

        const { name, value } = inputEvent.target;

        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleInputSelect = inputEvent => {
        resetWarning();

        const pickedOption = inputEvent.target.value;

        switch (pickedOption) {
            case "Gerant Buvette":
                setUser(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantMateriel: false,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "Gerant Matériel":
                setUser(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantBuvette: false,
                    isGerantMateriel: true}));
                setWarningCreateAdmin("");
                break;
            case "Double gérant":
                setUser(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantMateriel: true,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "Admin" :
                setUser(prevState => ({
                    ...prevState,
                    isGerantMateriel: false,
                    isGerantBuvette: false,
                    droits: pickedOption,
                    isAdmin: true}));
                setWarningCreateAdmin("Cet utilisateur sera ADMINISTRATEUR.")
                break;
            case "Aucun":
            default:
                setUser(prevState => ({
                    ...prevState,
                    isAdmin: false,
                    isGerantMateriel: false,
                    isGerantBuvette: false,
                    droits: pickedOption}));
                setWarningCreateAdmin("")
                break;
        }
    }




  return (

    <div >
        <form className='FormulaireSimple' onSubmit={validateForm}>
            <div className='VerticalLabel'>
                Nom :
            </div>
            <input
                className='LargeInput'
                placeholder='Nom'
                value={user.nom}
                type="text"
                onChange={handleInputs}
                name="nom"
                disabled={isInputDisabled}
            />
            <br />
            <div className='VerticalLabel'>
                Prenom :
            </div>
            <input
                className='LargeInput'
                placeholder='Prenom'
                value={user.prenom}
                type="text"
                onChange={handleInputs}
                name="prenom"
                disabled={isInputDisabled}
            />
            <br />
            <div className='VerticalLabel'>
                Adresse e-mail :
            </div>
            <input
                className='LargeInput'
                placeholder='Adresse e-mail'
                value={user.email}
                type="email"
                onChange={handleInputs}
                name="email"
                disabled={isInputDisabled}
            />
            <br />
            {displayPasswordField 
                ? <div style={{width:'100%'}}>
                    <br />
                    <div className='VerticalLabel'>
                        Mot de passe :
                    </div>

                    <input 
                        className='LargeInput'
                        placeholder='Mot de passe'
                        value={user.password}
                        type="password"
                        onChange={handleInputs}
                        name="password"
                        disabled={isInputDisabled}
                    />

                    <div className='VerticalLabel'>
                        Confirmation mot de passe :
                    </div>
                    <input
                        className='LargeInput'
                        placeholder='CONFIRMEZ le mot de passe'
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        type="password"
                        name="passwordConfirm"
                        disabled={isInputDisabled}
                    />                 
                </div>
                :""}
                
            <label>
                <div className='FancyBr'/>
                <div className='VerticalLabel'>
                    Droits de gestion : {" "} 
                </div>
                <select className='OptionSelector' onChange={handleInputSelect} value={user.droits} disabled={isInputDisabled}>
                    <option value="Aucun">Aucun (l'utilisateur sera un client)</option>
                    <option value="Gerant Buvette">Gérant de buvette</option>
                    <option value="Gerant Matériel">Gérant matériel</option>
                    <option value="Double gérant">Gérant buvette + matériel</option>
                    <option value="Admin">Administrateur</option>
                </select>
            </label>

            <br />
            <div className='Avertissement'>
                {warningCreateAdmin || "" }
            </div>

            <br />

            <div className='ButtonContainer'>
                <button className='ConfirmButton' disabled={isInputDisabled}>Vérifier la saisie</button>
                <button className='CancelButton' hidden={!isAddNewUser} onClick={resetEdits}>Annuler l'opération</button>
            </div>

        </form>
    </div>
  )
}
