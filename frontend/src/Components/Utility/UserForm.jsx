import React, { useState } from 'react'


export default function UserForm(props) {

    let userEdit = props.user;
    let setUserEdit = props.setUser;
    let validateForm = props.formHandler;
    let resetWarning = props.resetWarning;
    //↓ Si on décide d'afficher le champ pour le mot de passe, ça fait true et true, et on l'affiche. Sinon false par défaut
    let displayPasswordField = props.editPassword && true;
    //↓ Pour désactiver les inputs (suppressions utilisateur). C'est actif par défaut (si on ne transmet pas le props, il est false, l'input est actif)
    let isInputDisabled = props.disableInput && true;
    let setIsInputDisabled = props.setDisableInput || (() => {});
    //↑ Si le props pour (dés)activer les input n'a pas été transmis, setIsInputEnabled est une fonction vide

    const [warningCreateAdmin, setWarningCreateAdmin] = useState("");

    const resetEdits = () =>{
        setUserEdit({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"none"})

        resetWarning();
        setWarningCreateAdmin("");
        setIsInputDisabled(false);
    }

    

        //https://stackoverflow.com/questions/54150783/react-hooks--with-object 
    const handleInputs = inputEvent => {
        resetWarning();

        const { name, value } = inputEvent.target;

        setUserEdit(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleInputSelect = inputEvent => {
        resetWarning();

        const pickedOption = inputEvent.target.value;

        switch (pickedOption) {
            case "Gerant Buvette":
                setUserEdit(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantMateriel: false,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "Gerant Matériel":
                setUserEdit(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantBuvette: false,
                    isGerantMateriel: true}));
                setWarningCreateAdmin("");
                break;
            case "Double gérant":
                setUserEdit(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantMateriel: true,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "Admin" :
                setUserEdit(prevState => ({
                    ...prevState,
                    isGerantMateriel: false,
                    isGerantBuvette: false,
                    droits: pickedOption,
                    isAdmin: true}));
                setWarningCreateAdmin("Vous vous apprêtez à donner les droits ADMINISTRATEUR à cet utilisateur.")
                break;
            case "Aucun":
            default:
                setUserEdit(prevState => ({
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

    <div>
        <form onSubmit={validateForm}>
                <input
                    placeholder='nom'
                    value={userEdit.nom}
                    type="text"
                    onChange={handleInputs}
                    name="nom"
                    disabled={isInputDisabled}
                />
                <input
                    placeholder='prenom'
                    value={userEdit.prenom}
                    type="text"
                    onChange={handleInputs}
                    name="prenom"
                    disabled={isInputDisabled}
                />
                <input
                    placeholder='email'
                    value={userEdit.email}
                    type="text"
                    onChange={handleInputs}
                    name="email"
                    disabled={isInputDisabled}
                />
                {displayPasswordField 
                    ? <input
                        placeholder='mot de passe'
                        value={userEdit.password}
                        type="password"
                        onChange={handleInputs}
                        name="password"
                        disabled={isInputDisabled}
                    />
                    :""}       

                <label>
                    Droits de gestion : 
                    <select onChange={handleInputSelect} value={userEdit.droits} disabled={isInputDisabled}>
                        <option value="Aucun">Aucun</option>
                        <option value="Gerant Buvette">Gérant de buvette</option>
                        <option value="Gerant Matériel">Gérant matériel</option>
                        <option value="Double gérant">Gérant buvette + matériel</option>
                        <option value="Admin">Administrateur</option>
                    </select>
                </label>
                <button>Valider</button>
            </form>

            <button onClick={resetEdits}>Annuler l'opération</button>
        {warningCreateAdmin || " ---- avertissement création admin" }
        <br/>
    </div>
  )
}
