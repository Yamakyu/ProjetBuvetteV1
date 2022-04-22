import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';
import { useNavigate } from 'react-router-dom';



export default function ModifierUtilisateur() {

//------------------------------------------------------------------------- INITIALISATION

    const {activeSession, setActiveSession, isUserTokenExpired}= useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [checkEditUser, setCheckEditUser] = useState("");
    //const [isDoubleChecking, setIsDoubleChecking] = useState(false);
    const [confirmButton, setConfirmButton] = useState();
    const [warning, setWarning] = useState("");
    const [warningUserDelete, setWarningUserDelete] = useState("");
    const [apiSearchResponse, setApiSearchResponse] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [userListResult, setUserListResult] = useState([]);
    //const [isEditingUser, setisEditingUser] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [listUserDisplay, setListUserDisplay] = useState("");
    const [isFilteredList, setIsFilteredList] = useState(false);
    const [disableInput, setDisableInput] = useState(true);
    const [searchTool, setSearchTool] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [originalUser, setOriginalUser] = useState(null);
    const [userWorkedOn, setUserWorkedOn] = useState({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"Aucun"
    })

//------------------------------------------------------------------------- USE EFFECT

    //Au chargement de la page
    useEffect(() => {

        if (activeSession){
            apiGetAllUsers();
        } else {
            setActiveSession({
                userConnexionStatus:"Accès réservé. Veuillez vous connecter."
            })
            myAppNavigator("/login");
        }
            

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
    }, [userListResult]);
    
//------------------------------------------------------------------------- METHODES D'AFFICHAGE

    //https://stackoverflow.com/questions/57581147/how-to-display-objects-keys-and-values-in-react-component
    const displayInputedUser = (thatUser) => {
        return(
            <ul>
                {Object.entries(thatUser).map(([objectKey, value]) =>
                //Cette expression conditionelle permet de masquer les booléens (isAdmin, etc), le mot de passe et les dates de création/update
                objectKey.startsWith("is") || objectKey === "password" || objectKey.startsWith("crea") || objectKey.startsWith("upda")
                ? ""
                : <li key={objectKey}> {objectKey} :  
                {
                    originalUser                                //← Vide ou null si on est pas en train de modifier un utilisateur
                    ? value !== originalUser[objectKey]         //SI on modifie la valeur (par exemple, si on modifie le nom)
                        ? ` ${originalUser[objectKey]} ---→ `    //ALORS affichage de l'ancienne valeur à côté de la nouvelle (= value)
                        : ""
                    : ""
                } {value} </li>
                /*↑ originalUser est vide sauf si on fait une modification d'utilisateur. 
                Le cas échéant, SI l'ancienne valeur d'une propriété (par exemple, le nom) est changée alors on affiche l'ancienne valeur et la nouvelle. Sinon, on affiche seulement la "nouvelle" valeur (qui est inchangée)
                */
                )}
            </ul>
        );
    }

    const refreshDisplayUserList = () =>{

        setListUserDisplay(() => {
            if (userListResult){
                return(
                    <div>
                        <ul>
                            {Object.entries(userListResult).map(([objectKey, user]) =>
                            {
                                //Pour éviter des accidents, l'admin connecté n'est pas affiché dans la liste des utilisateurs modifiables.
                                if(user.id === activeSession.userInfo.id) {
                                    return "";
                                }else{
                                    return(
                                        <li key={objectKey}> {user.nom} {user.prenom} // {user.email} // Droits : {parseUserRights(user)} 
                                        {user.isActiveAccount
                                        ? " → " 
                                        : " |||| <COMPTE INACTIF> → " } 
                                        {<button onClick={() => prepareChangeAccountActiveState(user)}>{user.isActiveAccount ? "Supprimer" : "Restaurer"} cet utilisateur</button>}
                                        {<button onClick={() => prepareEditUser(user)}>Modifier cet utilisateur</button>}
                                        </li> 
                                    )
                                }
                            })
                            }               
                        </ul>
                        <br/>
                        {isFilteredList ? <button onClick={apiGetAllUsers}>Afficher la liste de tout les utilisateurs</button> : ""}
                    </div>
                        
                )
            }
        }
        )
    }

    const resetWarning = () => {
        setWarning("");
        setWarningUserDelete("");
        setConfirmButton("");
        //setIsDoubleChecking(false);
        //setCheckEditUser("");
        setSearchTool("");
        setOriginalUser(null);
    }
    
    const submitForm = (formEvent) => {
        //submitForm est appelé par le composant userForm.jsx

        formEvent.preventDefault();
        setApiResponse("");
        
        if (isEditingPassword && !disableInput && (passwordConfirm !== userWorkedOn.password)){
            setWarning("ATTENTION. La confirmation de mot de passe doit être identique au mot de passe entré !");
            //setIsDoubleChecking(false);
            setCheckEditUser("");
            setConfirmButton("");
            setWarningUserDelete("");
        } else {
            setWarning("Résumé des modification :");
            setConfirmButton(<button onClick={() => apiEditUser(userWorkedOn)}>Confirmer la modification ? </button>);
            setCheckEditUser(displayInputedUser(userWorkedOn));
            setWarningUserDelete("");
        }
        console.log(userWorkedOn);
    }

//------------------------------------------------------------------------- METHODES DE PRÉPARATON DE REQUÊTE

    let checkInactiveAccounts = false;

    const prepareSearchUserByName = () => {
        let nameToLookFor;
        resetWarning();
        setDisableInput(true);
        setCheckEditUser("");
        
        setSearchTool(
            <div>
                Rechercher un utilisateur dont le nom ou prénom est : 

                <input
                placeholder='Entrez un nom/prénom'
                value={nameToLookFor}
                type="text"
                onChange={(e) => nameToLookFor = e.target.value}
                name="searchName"
                />
                <br/>
               
                Inclure les utilisateurs inactifs (supprimés) ?
                <input type="checkbox" defaultChecked={false} value={checkInactiveAccounts} onChange={() => checkInactiveAccounts = !checkInactiveAccounts}/>

                <button onClick={() => apiSearchUsersByName(nameToLookFor, checkInactiveAccounts)}>Valider</button>
            </div>
        );
    }

    const prepareSearchUserByRole = () => {
        let roleToLookFor;
        resetWarning();
        setDisableInput(true);
        setCheckEditUser("");
        
        setSearchTool(
            <div>
                <label>
                    Rechercher un utilisateur ayant les droits de gestion suivants : 
                    <select onChange={(e) => roleToLookFor = e.target.value}>
                        <option value="Aucun">Aucun</option>
                        <option value="Gerant Buvette">Gérant de buvette</option>
                        <option value="Gerant Matériel">Gérant matériel</option>
                        <option value="Double gérant">Gérant buvette + matériel</option>
                        <option value="Admin">Administrateur</option>
                    </select>
                </label>
                <br/>
                Inclure les utilisateurs inactifs (supprimés) ?
                <input type="checkbox" defaultChecked={false} value={checkInactiveAccounts} onChange={() => checkInactiveAccounts = !checkInactiveAccounts}/>

                <button onClick={() => apiSearchUsersByRole(roleToLookFor, checkInactiveAccounts)}>Valider</button>
            </div>
        );
    }
    
    const prepareChangeAccountActiveState = (userSelected) => {
        userSelected = ({
            ...userSelected,
            droits: parseUserRights(userSelected)
        });

        setWarningUserDelete("Vous allez supprimer cet utilisateur");
        setCheckEditUser(displayInputedUser(userSelected));
        //setIsDoubleChecking(true);
        setSearchTool("");
        
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

        setConfirmButton(<button onClick={() => apiChangeUserActivation(userSelected)}>Confirmer la {userSelected.isActiveAccount ? "suppression" : "réactivation"}</button>);
    }

    const prepareEditUser = (userSelected) =>{
        userSelected = ({
            ...userSelected,
            droits: parseUserRights(userSelected)
        });

        setUserWorkedOn(userSelected);

        resetWarning();
        setDisableInput(false);
        setCheckEditUser("");
        
        if(userSelected.isActiveAccount){
            setApiResponse("");
        }else{
            setApiResponse(" Cet utilisateur est actuellement INACTIF. Un administrateur peut le restaurer. ");
        }

        setOriginalUser(userSelected);
        //↑ On aura besoin d'avoir une trace des informations utilisateur originelles
        setCheckEditUser(displayInputedUser(userSelected));
    }
//------------------------------------------------------------------------- METHODES DE TRAITEMENT et REQUÊTES

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
    
    const apiChangeUserActivation = async (thatUser) => {
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
            console.log("API response ↓");
            console.log(data.message);
            
            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }
            
            resetWarning();
            setDisableInput(true);
            setCheckEditUser("");
            setApiResponse(data.message);
            
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
        setDisableInput(true);
        setCheckEditUser("");

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

            setUserListResult(data.resultArray, setIsFilteredList(true));
            setApiSearchResponse(data.message);
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });

        console.log(isFilteredList);

    }

    const apiSearchUsersByName = async (thatName, isInactiveIncluded) => {
        resetWarning();
        setDisableInput(true);
        setCheckEditUser("");

        console.log("recherche " + thatName);
        console.log("comptes inactifs ? " + isInactiveIncluded);

        fetch("/api/users/search?name="+thatName,{
            method: "POST",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
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

            setApiSearchResponse(data.message);
            setUserListResult(data.resultArray,setIsFilteredList(true));
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });
    }

    const apiEditUser = async (thatUser) => {
        
        setApiResponse("Requête envoyée. L'opération peut prendre quelques secondes. En attente de la réponse du serveur... ");
        setConfirmButton("");
        let userAfterEdit;

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
                    isAdmin:thatUser.isAdmin
                })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);
            
            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }
            
            resetWarning();
            setDisableInput(true);
            setCheckEditUser("");

            setApiResponse(data.message);
            
            userAfterEdit = data.updatedUser;
            setUserWorkedOn(userAfterEdit);
            
        })
        .catch((err) => console.log(err));

        setUserListResult(
            userListResult.map(
                (user) => userAfterEdit.id ===  user.id 
                    ? userAfterEdit 
                    : user
            )
        );
    }

    const apiGetAllUsers = async () => {
        console.log("Returning all users...");

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
                setUserListResult(data.resultArray, setIsFilteredList(false));
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
            setPasswordConfirm={setPasswordConfirm}
            passwordConfirm={passwordConfirm}  
            refreshEditUserDisplay={displayInputedUser}
            /*
            doubleCheck={isDoubleChecking} 
            setDoubleChecking={setIsDoubleChecking} 
            confirmButton={confirmButton}
            setConfirmButton={setConfirmButton}*/
            >
        </UserForm>

        <br/>
        {warning || " ---- avertissement utilisateur"}
        <br/>
        {warningUserDelete || " ---- avertissement suppression utilisateur"}
        <br/>
        {/*isDoubleChecking ? displayInputedUser() : " ---- informations utilisateur"*/}
        {checkEditUser || " ---- informations utilisateur"}
        <br/>
        {confirmButton || " ---- bouton de confirmation"}
        <br/>
        {apiResponse || " ---- réponse API"}
        <br/>
        <br/>
        <br/>

        <button onClick={prepareSearchUserByRole}>Trouver des utilisateurs par droits</button>
        <button onClick={prepareSearchUserByName}>Trouver des utilisateurs par leur nom/prénom</button>
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
