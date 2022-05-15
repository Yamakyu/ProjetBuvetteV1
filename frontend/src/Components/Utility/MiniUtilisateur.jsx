import React from 'react'
import { useNavigate } from 'react-router-dom';


export default function MiniUtilisateur(props) {

    const myAppNavigator = useNavigate();
    let user = props.user;
    let goToEditUser = props.goToEditUser;
    let goToToggleUser = props.goToToggleUser;

    return (
        <>
            <br/>
            <div className='MiniUserCard'>
                {!user.isActiveAccount
                    ?<div className='Avertissement'><b>(Compte utilisateur inactif)</b></div>
                    :""
                }

                <div >
                    <b>Nom : </b>{user.nom} 
                    <br />
                    <b>Prénom :</b> {user.prenom}
                    <br />
                    <b>Adresse e-mail : </b> {user.email} 
                    <br />
                    <b>Droits de gestion : </b> {user.droits}
                </div>
            
                <div className='MiniCardButtonContainer'>
                    <button className='MiniCardConfirmButton' onClick={() => goToEditUser(user)}>Modifier</button>
                    
                
                    {user.isActiveAccount 
                        ? <button className='MiniCardRedButton' onClick={() => goToToggleUser(user)}>Supprimer</button>
                        : <button className='MiniCardSubButton' onClick={() => goToToggleUser(user)}>Restaurer</button>
                    }

                </div>
            </div>
        </>
      )
}
