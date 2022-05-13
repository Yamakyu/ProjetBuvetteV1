import Button from '@restart/ui/esm/Button'
import React, { useContext, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { SessionContext } from '../../Contexts/SessionContext'

export default function Utilisateur(props) {

    const { userWorkedOn }= useContext(SessionContext);

    const [passwordConfirm, setPasswordConfirm] = useState("");

    let user = props.user || userWorkedOn;
    let newUser = props.newUser;
    let isEditingUser = props.isEditingUser;
    let isEditingPassword = props.isEditingPassword;

    let backToEditThatUser = props.backToEditThatUser;
    let disableAddUser = props.disableAddUser;
    let addUser = props.addUser;
    
    let displayGoBackButton = props.displayGoBackButton; 
    let displayAddUserButton = props.displayAddUserButton; 
    let displayEditButton = props.displayEditButton;
    let displayDeleteButton = props.displayDeleteButton; 


  return (
    <>
        <br/>
        <div className='UserCard'>

           
                <div className='VerticalLabel'><b>Nom : </b>{user.nom}
                    {(isEditingUser && (newUser.nom !== user.nom)) 
                        ? <> → <b>{newUser.nom}</b> </>
                        : ""}
                </div>
                
                <div className='VerticalLabel'><b>Prénom :</b> {user.prenom}
                    {(isEditingUser && (newUser.prenom !== user.prenom)) 
                        ? <> → <b>{newUser.prenom}</b> </>
                        : ""}
                </div>

                <div className='VerticalLabel'><b>Adresse e-mail : </b> {user.email}
                    {(isEditingUser && (newUser.email !== user.email)) 
                        ? <> → <b>{newUser.email}</b> </>
                        : ""}
                </div>

                <div className='VerticalLabel'><b>Droits de gestion : </b> {user.droits}
                    {(isEditingUser && (newUser.droits !== user.droits)) 
                        ? <> → <b>{newUser.droits}</b> </>
                        : ""}
                </div>
      

            
            <div className='ButtonContainer'>
                <button className='ConfirmButton' hidden={!displayAddUserButton || disableAddUser} onClick={() => {addUser()}}>Ajouter l'tilisateur</button>
                <button className='CancelButton' hidden={!displayGoBackButton} onClick={() => {backToEditThatUser()}}>Modifier la saisie</button>

                <button className='SubButton' hidden={!displayEditButton} onClick={() => {}}>Modifier cet utilisateur</button>
                <button className='RedButton' hidden={!displayDeleteButton} onClick={() => {}}>Supprimer cet utilisateur</button>
            </div>

        </div>
    </>
  )
}
