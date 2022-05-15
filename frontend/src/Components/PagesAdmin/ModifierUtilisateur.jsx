import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SessionContext } from '../../Contexts/SessionContext';
import Utilisateur from '../Utility/Utilisateur';

export default function ModifierUtilisateur() {

  const {
    activeSession,
    isUserTokenExpired,
    userWorkedOn, 
    setUserWorkedOn, 
    fullUserList, 
    setFullUserList
  } = useContext(SessionContext);

  const [apiResponse, setApiResponse] = useState("");
  const [baseUser, setBaseUser] = useState(userWorkedOn);
  const [disableConfirmButton, setDisableConfirmButton] = useState(false);

  const { id } = useParams();

  const myAppNavigator = useNavigate();

  useEffect(() => {
    // ????  
  
    return () => {}
  }, [])



  const apiEditUser = async (thatUser) => {
        
    setApiResponse("Requête envoyée. L'opération peut prendre quelques secondes. En attente de la réponse du serveur... ");
    let userAfterEdit;
    setDisableConfirmButton(true);

    await fetch(`/api/users/edit/${thatUser.id}`,{
      method: "PUT",
      headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
      body: JSON.stringify(
      {
        id: undefined,
        nom: thatUser.nom,
        prenom:thatUser.prenom,
        email:thatUser.email,
        isGerantBuvette:thatUser.isGerantBuvette,
        isGerantMateriel:thatUser.isGerantMateriel,
        isAdmin:thatUser.isAdmin, 
        droits:thatUser.droits,
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
      setDisableConfirmButton(false);
    })
    .catch((err) => console.log(err));

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
      <h1>Vous pouvez modifier cet utilisateur</h1>


      <div className='BoxSimple'>

      <div className='APIResponse'>
          {apiResponse || ""}
          </div>

          <Utilisateur
              user = {baseUser}
              newUser = {userWorkedOn}
              displayGoBackToOvrwiewButton
              displayEditButton
              displayGoBackButton
              isEditingUser
              dispableInputs
              backEndAPIRequest = {apiEditUser}
          />
      </div>
    </div>
  )
}
