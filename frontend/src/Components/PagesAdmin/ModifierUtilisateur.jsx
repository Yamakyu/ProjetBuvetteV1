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

  const emptyUser = {
    nom: "",
    prenom: "",
    email: "",
    password: "",
    droits: "Aucun",
    isActiveAccount: true
  }

  useEffect(() => {

    /*Si l'utilisateur fait "retour" après avoir quitté la page de modification utilisateur, il va se retrouver avec des infos utilisateur
    vides. Pour palier à cela, si les infos sont vide (baseUser === emptyUser), on récupère l'id de l'utilisateur en question (depuis l'URL)
    et on affiche l'utilisateur correspondant grâce à fullUserList */
    if (JSON.stringify(baseUser) === JSON.stringify(emptyUser)){
      console.log(fullUserList);

      //↓ On entre dans ce cas de figure si on actualise la page de modification (ça reset les states)
      if (fullUserList.length === 0){
        setApiResponse("Erreur : Veuillez accéder à la liste des utilisateurs, et sélectionner cet utilisateur de nouveau")
      } else {
        fullUserList.forEach(thatUser => {
          if (thatUser.id == id){
            setUserWorkedOn(thatUser);
            return setBaseUser(thatUser);
          }
        })
      }
    //↑ Utile uniquement quand on actualise
  }
  
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
          disableConfirmButton={fullUserList.length===0}
          backEndAPIRequest = {apiEditUser}
        />
      </div>
    </div>
  )
}
