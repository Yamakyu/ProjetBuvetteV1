import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';
import { useNavigate } from 'react-router-dom';



export default function ModifierUtilisateur() {

//------------------------------------------------------------------------- INITIALISATION

    const {activeSession, setActiveSession, isUserTokenExpired}= useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [isDoubleChecking, setIsDoubleChecking] = useState(false);
    const [confirmButton, setConfirmButton] = useState();
    const [warning, setWarning] = useState("");
    const [warningUserDelete, setWarningUserDelete] = useState("");
    const [apiSearchResponse, setApiSearchResponse] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [userListResult, setUserListResult] = useState([]);
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [listUserDisplay, setListUserDisplay] = useState("");
    const [disableInput, setDisableInput] = useState(false);
    const [searchTool, setSearchTool] = useState();
    const [userWorkedOn, setUserWorkedOn] = useState({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"none"
    })

//------------------------------------------------------------------------- USE EFFECT

    //Au chargement de la page
    useEffect(() => {
         
            fetch("/api/users/search/all",{
                method: "POST",
                headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
                body: JSON.stringify(
                    {
                        isInactiveAccountsIncluded: true,
                    })
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("API response ↓");
                console.log(data.message);

                if (isUserTokenExpired(data)){
                    myAppNavigator("/login");
                }
                setUserListResult(data.resultArray);
            })
            .catch((err) => {
                console.log(err.message);
                console.log(err);
            });

      return () => {
        //cleanup
      }
    }, []);

    //À chaque mise à jour de la liste des résultats
    useEffect(() => {
        refreshDisplayUserList();    
      return () => {
        //Cleanup
      }
    }, [userListResult])
    
//------------------------------------------------------------------------- METHODES D'AFFICHAGE

    //https://stackoverflow.com/questions/57581147/how-to-display-objects-keys-and-values-in-react-component
    const displayInputedUser = () => {
        return(
            <ul>
                {Object.entries(userWorkedOn).map(([objectKey, value]) =>
                //Cette expression conditionelle permet de masquer les booléens (isAdmin, etc), le mot de passe et les dates de création/update
                objectKey.startsWith("is") || objectKey === "password" || objectKey.startsWith("crea") || objectKey.startsWith("upda")
                ? ""
                : <li key={objectKey}> {objectKey} : {value} </li>
                )}
            </ul>
        );
    }

    const refreshDisplayUserList = () =>{

        setListUserDisplay(() => {
            if (userListResult){
                return(
                        <ul>
                            {Object.entries(userListResult).map(([objectKey, user]) =>
                            {
                                //Pour éviter des accidents, l'admin connecté n'est pas affiché dans la liste des utilisateurs modifiables.
                                if(user.id === activeSession.userInfo.id) {
                                    return;
                                }else{
                                    return(
                                        <li key={objectKey}> {user.nom} {user.prenom} // {user.email} // Droits : {parseUserRights(user)} 
                                        {user.isActiveAccount
                                        ? " → " 
                                        : " |||| <COMPTE INACTIF> → " } 
                                        {<button onClick={() => prepareChangeAccountActiveState(user)}>{user.isActiveAccount ? "Supprimer" : "Restaurer"} cet utilisateur</button>}
                                        </li> 
                                    )
                                }
                            })
                            }               
                        </ul>
                )
            }
        }
        )
    }

    const resetWarning = () => {
        setWarning("");
        setWarningUserDelete("");
        setConfirmButton("");
        setIsDoubleChecking(false);
    }
    
    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        console.log(userWorkedOn);

        setWarning("Résumé des modification :");
        setWarningUserDelete("");
        setConfirmButton(<button>Confirmer la modification</button>);
        setIsDoubleChecking(true);
    }

    const prepareChangeAccountActiveState = (userSelected) => {
        setWarningUserDelete("Vous allez supprimer cet utilisateur");
        setIsDoubleChecking(true);
        
        //Si l'utilisateur veut activer/désactiver un compte, on évite de lui laisser la possibilité de modifier d'autres éléments du compte
        setDisableInput(true);

        setWarning("");
        if(userSelected.isActiveAccount){
            setApiResponse("");
        }else{
            setApiResponse(" Cet utilisateur est actuellement INACTIF. En validant vous confirmez vouloir le réactiver. ");
        }

        setUserWorkedOn(() => ({
            ...userSelected,
            droits: parseUserRights(userSelected)
        }));

        setConfirmButton(<button onClick={() => apiChangeAccountActiveState(userSelected)}>Confirmer la {userSelected.isActiveAccount ? "suppression" : "réactivation"}</button>);
    }


//------------------------------------------------------------------------- METHODES DE TRAITEMENT


    //Dans la BdD les droits sont des booléens, on parse ceci.
    const parseUserRights = (thatUser) => {
        if (thatUser.isAdmin){
            return "Admin";
        }else if (thatUser.isGerantBuvette && thatUser.isGerantMateriel){
            return "Double gérant";
        }else if (!thatUser.isGerantBuvette && !thatUser.isGerantMateriel) {
            return "Aucun";
        }else {
            return thatUser.isGerantBuvette 
            ? "Gerant Buvette"
            : "Gerant Matériel"
        };
    }
    
    const prepareSearchUserByRole = () => {
        let checkInactiveAccounts = false;
        let roleToLookFor;
        
        setSearchTool(
            <div>
                <label>
                    Droits de gestion :  
                    <select onChange={(e) => roleToLookFor = e.target.value}>
                        <option value="Aucun">Aucun</option>
                        <option value="Gerant Buvette">Gérant de buvette</option>
                        <option value="Gerant Matériel">Gérant matériel</option>
                        <option value="Double gérant">Gérant buvette + matériel</option>
                        <option value="Admin">Administrateur</option>
                    </select>
                </label>
                 Inclure les comptes inactifs (supprimés) ?
                <input type="checkbox" defaultChecked={false} value={checkInactiveAccounts} onChange={() => checkInactiveAccounts = !checkInactiveAccounts}/>

                <button onClick={() => apiSearchUsersByRole(roleToLookFor, checkInactiveAccounts)}>Valider</button>
            </div>
        );
    }

    const apiChangeAccountActiveState = async (thatUser) => {
        setApiResponse("Requête envoyée. L'opération peut prendre quelques secondes. En attente de la réponse du serveur... ");
        setConfirmButton("");
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
            
            resetWarning();
            setApiResponse(data.message);

            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }
            
            userAfterEdit = data.updatedUser;
            setUserWorkedOn(userAfterEdit);
            
        })
        .catch((err) => console.log(err));

        //https://stackoverflow.com/questions/37585309/replacing-objects-in-array
        //Cette expression permet de *remplacer* un objet dans un array qui contient des objets. Inspiré du lien ci dessus
        setUserListResult(
            userListResult.map(
                (user) => userAfterEdit.id ===  user.id 
                ? userAfterEdit 
                : user
            )
        );
    }

    const apiSearchUsersByRole = async (thatRole, isInactiveIncluded) => {
        resetWarning();
        console.log("recherche " + thatRole);
        console.log("comptes inactifs ? " + isInactiveIncluded);

        fetch("/api/users/search/role",{
            method: "POST",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
                    filter:thatRole,
                    isInactiveAccountsIncluded: isInactiveIncluded,
                }
            )
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);

            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }

            

            setUserListResult(data.resultArray);
            setApiSearchResponse(data.message);
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });
    }

//------------------------------------------------------------------------- AFFICHAGE


  return (
    <div>
        <br/>
        <h1>MODIFIER OU SUPPRIMER UN UTILISATEUR</h1>
        <br/>

        <UserForm 
            formHandler={submitForm}
            user={userWorkedOn}
            setUser={setUserWorkedOn}
            resetWarning={resetWarning}
            editPassword={isEditingPassword}
            disableInput={disableInput}
            setDisableInput={setDisableInput}
            /*
            doubleCheck={isDoubleChecking} 
            setDoubleChecking={setIsDoubleChecking} 
            confirmButton={confirmButton}
            setConfirmButton={setConfirmButton}*/
            >    
        </UserForm>

        <br/>
        {warning || " ---- affichage des informations entrées"}
        <br/>
        {warningUserDelete || " ---- avertissement suppression utilisateur"}
        <br/>
        {isDoubleChecking ? displayInputedUser() : " ---- informations utilisateur"}
        <br/>
        {confirmButton || " ---- bouton de confirmation"}
        <br/>
        {apiResponse || " ---- réponse API"}
        <br/>
        <br/>
        <br/>

        <button onClick={prepareSearchUserByRole}>Trouver des utilisateurs par droits</button>
        <br/>
        {searchTool || " ---- filtre de rechercehe"}
        <br/>
        <br/>
        {apiSearchResponse || " Liste des utilisateurs :"}

        {/*Par défaut on affiche "liste utilisateurs, mais quand on fait des recherches on va plutôt
        afficher "Résultats de la recherche", qui est donné en réponse de l'API Fetch.
        cf setApiSearchResponse() */}
        <br/>
        {listUserDisplay ||  " ---- affichage de la liste des utilisateurs" }
    </div>


  )
}
