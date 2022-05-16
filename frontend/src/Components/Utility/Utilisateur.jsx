import Button from '@restart/ui/esm/Button'
import React, { useContext, useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { SessionContext } from '../../Contexts/SessionContext'

export default function Utilisateur(props) {

    const { userWorkedOn, setUserWorkedOn, fullUserList }= useContext(SessionContext);

    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [warningCreateAdmin, setWarningCreateAdmin] = useState("");
    const myAppNavigator = useNavigate();
    const { id } = useParams();

    

    let user = props.user || userWorkedOn;
    let newUser = props.newUser;
    let isEditingUser = props.isEditingUser;

    let backEndAPIRequest = props.backEndAPIRequest;
    
    let displayGoBackToAddUserButton = props.displayGoBackToAddUserButton; 
    let displayGoBackToOvrwiewButton = props.displayGoBackToOvrwiewButton;
    let displayAddUserButton = props.displayAddUserButton; 
    let displayEditButton = props.displayEditButton;
    let displayDeleteButton = props.displayDeleteButton; 
    
    let disableAddUser = props.disableAddUser;
    let disableConfirmButton = props.disableConfirmButton;

    useEffect(() => {

        setUserWorkedOn(() => ({
          ...userWorkedOn,
          password:""
      }))
    
      return () => {}
    }, [])
    

//----------------------------------------------------------- TRAITEMENT


    const handleInputs = inputEvent => {
        const { name, value } = inputEvent.target;

        setUserWorkedOn(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleInputSelect = inputEvent => {
        const pickedOption = inputEvent.target.value;

        switch (pickedOption) {
            case "Gerant Buvette":
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantMateriel: false,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "Gerant Matériel":
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantBuvette: false,
                    isGerantMateriel: true}));
                setWarningCreateAdmin("");
                break;
            case "Double gérant":
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    droits: pickedOption,
                    isAdmin: false,
                    isGerantMateriel: true,
                    isGerantBuvette: true}));
                setWarningCreateAdmin("");
                break;
            case "Admin" :
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    isGerantMateriel: false,
                    isGerantBuvette: false,
                    droits: pickedOption,
                    isAdmin: true}));
                setWarningCreateAdmin("Cet utilisateur sera ADMINISTRATEUR.")
                break;
            case "Aucun":
            default:
                setUserWorkedOn(prevState => ({
                    ...prevState,
                    isAdmin: false,
                    isGerantMateriel: false,
                    isGerantBuvette: false,
                    droits: pickedOption}));
                setWarningCreateAdmin("")
                break;
        }
    }


//----------------------------------------------------------- TRAITEMENT



  return (
    <div>
        <br/>
        <div className='UserCard'>

            {user.isActiveAccount
                ?""
                :<div className='Avertissement'><b>(Compte utilisateur inactif)</b></div>
            }

            <div className='VerticalLabel'><u>Nom :</u> {user.nom}
                {(isEditingUser && (newUser.nom !== user.nom)) 
                    ? <> → <b>{newUser.nom}</b> </>
                    : ""}
            </div>
            
            <div className='VerticalLabel'><u>Prénom :</u> {user.prenom}
                {(isEditingUser && (newUser.prenom !== user.prenom)) 
                    ? <> → <b>{newUser.prenom}</b> </>
                    : ""}
            </div>

            <div className='VerticalLabel'><u>Adresse e-mail :</u> {user.email}
                {(isEditingUser && (newUser.email !== user.email)) 
                    ? <> <br/> → <b>{newUser.email}</b> </>
                    : ""}
            </div>

            <div className='VerticalLabel'><u>Droits de gestion :</u> {user.droits}
                {(isEditingUser && (newUser.droits !== user.droits)) 
                    ? <> <br /> → <b>{newUser.droits}</b> </>
                    : ""}
            </div>


            <div className='ButtonContainer'>
                <button className='ConfirmButton' hidden={!displayAddUserButton || disableAddUser} disabled={disableConfirmButton} onClick={() => backEndAPIRequest(user)}>Ajouter l'tilisateur</button>
                <button className='CancelButton' hidden={!displayGoBackToAddUserButton} onClick={() => {myAppNavigator("/manage/users/add")}}>Modifier la saisie</button>

                <button className='ConfirmButton' hidden={!displayEditButton} disabled={disableConfirmButton} onClick={() => backEndAPIRequest(newUser)}>Valider les modifications</button>
                
                {user.isActiveAccount 
                    ? <button className='RedButton' hidden={!displayDeleteButton} disabled={disableConfirmButton}  onClick={() => backEndAPIRequest(user)}>Supprimer cet utilisateur</button>
                    : <button className='ConfirmButton' hidden={!displayDeleteButton} onClick={() => backEndAPIRequest(user)}>Restaurer cet utilisateur</button>
                }
            
                <button className='SubButton' hidden={!displayGoBackToOvrwiewButton} onClick={() => {myAppNavigator("/manage/users/overview")}}>Liste des utilisateurs</button>
            </div>


            {
            isEditingUser
                ?<div className='FancyBr'>
                    <hr />
                    <h4>Entrez les modifications désirées</h4>
                    <div className='VerticalLabel'>
                        Nom :
                    </div>
                    <input
                        className='LargeInput'
                        placeholder='Nom'
                        value={newUser.nom}
                        type="text"
                        onChange={handleInputs}
                        name="nom"
                    />
                    <br />
                    <div className='VerticalLabel'>
                        Prenom :
                    </div>
                    <input
                        className='LargeInput'
                        placeholder='Prenom'
                        value={newUser.prenom}
                        type="text"
                        onChange={handleInputs}
                        name="prenom"
                    />
                    <br />
                    <div className='VerticalLabel'>
                        Adresse e-mail :
                    </div>
                    <input
                        className='LargeInput'
                        placeholder='Adresse e-mail'
                        value={newUser.email}
                        type="email"
                        onChange={handleInputs}
                        name="email"
                    />

                    <label>
                        <div className='FancyBr'/>
                        <div className='VerticalLabel'>
                            Droits de gestion : {" "} 
                        </div>
                        <select className='OptionSelector' onChange={handleInputSelect} value={newUser.droits}>
                            <option value="Aucun">Aucun (l'utilisateur sera un client)</option>
                            <option value="Gerant Buvette">Gérant de buvette</option>
                            <option value="Gerant Matériel">Gérant matériel</option>
                            <option value="Double gérant">Gérant buvette + matériel</option>
                            <option value="Admin">Administrateur</option>
                        </select>
                    </label>
                    <div className='Avertissement'>
                        {warningCreateAdmin || "" }
                    </div>
                    <div className='FancyBr'/>
                </div>
                :""
            }
        </div>
    </div>
  )
}