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
    <div>
        <br/>
        <div className='UserCard'>

           
                <div className='VerticalLabel'><b>Nom : </b>{user.nom}
                    {(isEditingUser && (newUser.nom !== user.nom)) 
                        ? <><br /> → <b>{newUser.nom}</b> </>
                        : ""}
                </div>
                
                <div className='VerticalLabel'><b>Prénom :</b> {user.prenom}
                    {(isEditingUser && (newUser.prenom !== user.prenom)) 
                        ? <><br /> → <b>{newUser.prenom}</b> </>
                        : ""}
                </div>

                <div className='VerticalLabel'><b>Adresse e-mail : </b> {user.email}
                    {(isEditingUser && (newUser.email !== user.email)) 
                        ? <><br /> → <b>{newUser.email}</b> </>
                        : ""}
                </div>

                <div className='VerticalLabel'><b>Droits de gestion : </b> {user.droits}
                    {(isEditingUser && (newUser.droits !== user.droits)) 
                        ? <><br /> → <b>{newUser.droits}</b> </>
                        : ""}
                </div>



                {/*isEditingUser
                    ?<div className='FancyBr'>


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


                    </div>
                    :""
                        */}




      

            
            <div className='ButtonContainer'>
                <button className='ConfirmButton' hidden={!displayAddUserButton || disableAddUser} onClick={() => {addUser()}}>Ajouter l'tilisateur</button>
                <button className='CancelButton' hidden={!displayGoBackButton} onClick={() => {backToEditThatUser()}}>Modifier la saisie</button>

                <button className='SubButton' hidden={!displayEditButton} onClick={() => {}}>Modifier cet utilisateur</button>
                <button className='RedButton' hidden={!displayDeleteButton} onClick={() => {}}>Supprimer cet utilisateur</button>
            </div>

        </div>
    </div>
  )
}
