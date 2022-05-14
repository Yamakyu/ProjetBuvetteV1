import React from 'react'
import { useNavigate } from 'react-router-dom';


export default function MiniUtilisateur(props) {

    const myAppNavigator = useNavigate();
    let user = props.user;

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
                    <button className='MiniCardSubButton' onClick={() => myAppNavigator("/manage/users/edit/"+user.id)}>Modifier</button>
                    <button className='MiniCardRedButton' onClick={() => {console.log("Suppression")}}>{user.isActiveAccount ? "Supprimer" : "Restaurer"}</button>
                </div>

    
            </div>
        </>
      )
}
