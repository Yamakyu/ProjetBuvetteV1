import React, { useState } from 'react'


export default function UserForm(props) {

    let userEdit = props.user;
    let setUserEdit = props.setUser;
    let validateForm = props.formHandler;
    let resetWarning = props.resetWarning;
    //↓ Si on décide d'afficher le champ pour le mot de passe, ça fait true et true, et on l'affiche. Sinon false par défaut
    let displayPasswordField = props.editPassword && true;

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
            case "buvette":
                setUserEdit(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantMateriel: false,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "materiel":
                setUserEdit(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantBuvette: false,
                    isGerantMateriel: true}));
                setWarningCreateAdmin("");
                break;
            case "both":
                setUserEdit(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantMateriel: true,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "admin" :
                setUserEdit(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: true}));
                setWarningCreateAdmin("Vous vous apprêtez à donner les droits ADMINISTRATEUR à cet utilisateur.")
                break;
            case "none":
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
                />
                <input
                    placeholder='prenom'
                    value={userEdit.prenom}
                    type="text"
                    onChange={handleInputs}
                    name="prenom"
                />
                <input
                    placeholder='email'
                    value={userEdit.email}
                    type="text"
                    onChange={handleInputs}
                    name="email"
                />
                {displayPasswordField 
                    ? <input
                        placeholder='mot de passe'
                        value={userEdit.password}
                        type="password"
                        onChange={handleInputs}
                        name="password"
                    />
                    :""}       

                <label>
                    Droits de gestion : 
                    <select onChange={handleInputSelect} value={userEdit.droits}>
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
    </div>
  )
}
