import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SessionContext } from '../../Contexts/SessionContext';
import Utilisateur from '../Utility/Utilisateur';

export default function SupprimerUtilisateur() {

    const {
        activeSession,
        isUserTokenExpired,
        userWorkedOn, 
        setUserWorkedOn, 
        fullUserList, 
        setFullUserList
    } = useContext(SessionContext);

    const [apiResponse, setApiResponse] = useState("");

    const { id } = useParams();

    const myAppNavigator = useNavigate();

//------------------------------------------------------------------------- REQUÊTES

    const apiToggleUser = async (thatUser) => {
        setApiResponse("Requête envoyée. L'opération peut prendre quelques secondes. En attente de la réponse du serveur... ");
        let userAfterEdit;

        await fetch(`/api/users/edit/${thatUser.id}`,{
            method: "PUT",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
                    isActiveAccount:!thatUser.isActiveAccount
                })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);
            
            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }
            
            setApiResponse(data.message);
            
            userAfterEdit = data.updatedUser;
            setUserWorkedOn(userAfterEdit);            
        })
        .catch((err) => console.log(err));

        //https://stackoverflow.com/questions/37585309/replacing-objects-in-array
        //Cette expression permet de *remplacer* un objet dans un array qui contient des objets. Inspiré du lien ci dessus
        setFullUserList(
            fullUserList.map(
                (user) => userAfterEdit.id ===  user.id 
                ? userAfterEdit 
                : user
            )
        );
    }


    return (
        <div>
            <h1>Cet utilisateur sera supprimé</h1>


            <div className='BoxSimple'>

            <div className='APIResponse'>
                {apiResponse || ""}
            </div>

            <Utilisateur
                user = {userWorkedOn}
                newUser = {null}
                displayGoBackToOvrwiewButton
                displayDeleteButton
                displayGoBackButton
                backEndAPIRequest = {apiToggleUser}
            />
        </div>
    </div>
    )
}
