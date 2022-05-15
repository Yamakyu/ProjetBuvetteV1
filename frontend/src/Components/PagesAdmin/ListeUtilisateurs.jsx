import React, { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../../Contexts/SessionContext'
import UserForm from '../Utility/UserForm';
import { useNavigate } from 'react-router-dom';
import MiniUtilisateur from '../Utility/MiniUtilisateur';

export default function ListeUtilisateurs() {

//------------------------------------------------------------------------- INITIALISATION

    const {
        activeSession, 
        setActiveSession, 
        isUserTokenExpired, 
        fullUserList, 
        setFullUserList, 
        userWorkedOn, 
        setUserWorkedOn
    } = useContext(SessionContext);

    const myAppNavigator = useNavigate();

    const [checkEditUser, setCheckEditUser] = useState("");
    //const [isDoubleChecking, setIsDoubleChecking] = useState(false);
    const [confirmButton, setConfirmButton] = useState();
    const [warning, setWarning] = useState("");
    const [warningUserDelete, setWarningUserDelete] = useState("");
    const [apiSearchResponse, setApiSearchResponse] = useState("");
    const [apiResponse, setApiResponse] = useState("");

    const [searchType, setSearchType] = useState("");

    const [userListResult, setUserListResult] = useState([]);

    //const [isEditingUser, setisEditingUser] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [listUserDisplay, setListUserDisplay] = useState("");
    const [isFilteredList, setIsFilteredList] = useState(false);
    const [disableInput, setDisableInput] = useState(true);
    const [searchTool, setSearchTool] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [originalUser, setOriginalUser] = useState(null);
    
    /*
    const [userWorkedOn, setUserWorkedOn] = useState({
        nom:"",
        prenom:"",
        email:"",
        password:"",
        droits:"Aucun"
    })
    */

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

        setUserWorkedOn({
            nom:"",
            prenom:"",
            email:"",
            password:"",
            droits:"Aucun"
        })      
        /* ↑ Afin de parer à l'éventualité où l'utilisateur revient de la page d'édition/suppression utilisateur, on reset
        userWorkedOn, ce qui empêchera d'afficher les informations la prochaine fois que l'utilisateur décide d'ajouter un 
        nouvel utilisateur. Ainsi, la formulaire d'ajout ne sera pas pré-rempli avec des informations d'un utilisateur existant.
        La même opération est réalisée dans GestionUtilisateurs.jsx */
            

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
    /*
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
                        {isFilteredList ? <button onClick={() => setUserListResult(fullUserList, setIsFilteredList(false), setSearchTool(''))}>Afficher la liste de tout les utilisateurs</button> : ""}
                    </div>
                        
                )
            }
        }
        )
    }
    */
    
    const refreshDisplayUserList = () =>{

        setListUserDisplay(() => {
            if (userListResult){
                return(
                    <>
                        {isFilteredList ? <button className='MiniCardCancelButton' onClick={() => setUserListResult(fullUserList, setIsFilteredList(false), setSearchTool(''))}>Afficher la liste de tout les utilisateurs</button> : ""}
                        <div className='BoxSimple'>
                            {Object.entries(userListResult).map(([objectKey, user]) =>
                            {
                                //Pour éviter des accidents, l'admin connecté n'est pas affiché dans la liste des utilisateurs modifiables.
                                if(user.id === activeSession.userInfo.id) {
                                    return "";
                                }else{
                                    return(
                                        <MiniUtilisateur 
                                            key={objectKey} 
                                            user={user}
                                            goToToggleUser={goToToggleUser}
                                            goToEditUser={goToEditUser}/> 
                                    )
                                }
                            })
                            }               
                        </div>
                        <br/>
                        {isFilteredList ? <button className='MiniCardCancelButton'  onClick={() => setUserListResult(fullUserList, setIsFilteredList(false), setSearchTool(''))}>Afficher la liste de tout les utilisateurs</button> : ""}
                    </>
                        
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

    const handleInputSelect = (inputEvent) => {
        setSearchType(inputEvent.target.value);

        switch (inputEvent.target.value) {
            case "name":
                prepareSearchUserByName();    
                break;
            case "email":  
                prepareSearchUserByMail();
                break;
            case "droits":
                prepareSearchUserByRole();
                break;
            case "all":
            default:
                setApiSearchResponse('');
                setSearchTool("");
                setUserListResult(fullUserList);
                setIsFilteredList(false);
                break
            }



    }

    const prepareSearchUserByName = () => {
        let nameToLookFor;
        resetWarning();
        setDisableInput(true);
        setCheckEditUser("");
        
        setSearchTool(
            <div>
                Rechercher un utilisateur dont le nom ou prénom est : {" "}

                <input
                placeholder='Nom ou prénom'
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
                    Rechercher un utilisateur ayant les droits de gestion suivants : {" "}
                    <select onChange={(e) => roleToLookFor = e.target.value}>
                        <option value="Aucun">Aucun</option>
                        <option value="Gerant Buvette">Gérant de buvette</option>
                        <option value="Gerant Matériel">Gérant matériel</option>
                        <option value="Double gérant">Double gérant</option>
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

    const prepareSearchUserByMail = () => {
        let mailToLookFor;
        resetWarning();
        setDisableInput(true);
        setCheckEditUser("");
        
        setSearchTool(
            <div>
                Rechercher un utilisateur dont l'adresse e-mail *exacte* est : {" "}

                <input
                placeholder='Adresse e-mail'
                value={mailToLookFor}
                type="text"
                onChange={(e) => mailToLookFor = e.target.value}
                name="searchMail"
                />
                <br/>
               
                Inclure les utilisateurs inactifs (supprimés) ?
                <input type="checkbox" defaultChecked={false} value={checkInactiveAccounts} onChange={() => checkInactiveAccounts = !checkInactiveAccounts}/>

                <button onClick={() => apiSearchUsersByMail(mailToLookFor, checkInactiveAccounts)}>Valider</button>
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
//------------------------------------------------------------------------- METHODES DE NAVIGATION

    const goToEditUser = (thatUser) => {
        setUserWorkedOn(thatUser);
        myAppNavigator("/manage/users/edit/"+thatUser.id);
    }

    const goToToggleUser = (thatUser) => {
        setUserWorkedOn(thatUser);
        myAppNavigator("/manage/users/toggle/"+thatUser.id);
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

            setApiSearchResponse(data.message);
            setIsFilteredList(true);

            if(data.resultArray){
                setUserListResult(data.resultArray);
            }else {
                setUserListResult([]);
            }


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

        fetch("/api/users/search/name?name="+thatName,{
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
            setIsFilteredList(true);

            if(data.resultArray){
                setUserListResult(data.resultArray);
            }else {
                setUserListResult([]);
            }
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });
    }

    const apiSearchUsersByMail = async (thatMail, isInactiveIncluded) => {
        resetWarning();
        setDisableInput(true);
        setCheckEditUser("");

        console.log("recherche " + thatMail);
        console.log("comptes inactifs ? " + isInactiveIncluded);

        fetch("/api/users/search/mail?mail="+thatMail,{
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
            setIsFilteredList(true);

            if(data.resultArray){
                setUserListResult(data.resultArray);
            }else {
                setUserListResult([]);
            }
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

    //Appelé uniquement quand on charge (ou) refresh la page
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
                setApiSearchResponse('');
                setUserListResult(data.resultArray, setIsFilteredList(false));
                setFullUserList(data.resultArray);
            })
            .catch((err) => {
                console.log(err.message);
                console.log(err);
            });
    }


//------------------------------------------------------------------------- AFFICHAGE


  return (
    <div>
        <h3>
            <label>
                Rechercher des utilisateurs... ? {" "}
                <select onChange={handleInputSelect}>
                    <option value="all"> Afficher tout les utilisateurs </option>
                    <option value="name"> Rechercher par nom ou prénom </option>
                    <option value="email"> Rechercher par adresse e-mail </option>
                    <option value="droits"> Rechercher par droits</option>
                </select>
            </label>
        </h3>
        {searchTool}
        <hr className='FancyHr'/>
        <h1>{apiSearchResponse || " Liste de tout les utilisateurs :"}</h1>
        {/*Par défaut on affiche "liste de tout les utilisateurs, mais quand on fait des recherches on 
        va plutôt  afficher "Résultats de la recherche", qui est donné en réponse de l'API Fetch.
        cf setApiSearchResponse() */}   
        {listUserDisplay ||  " ---- affichage de la liste des utilisateurs" }

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

        <br/>
        <br/>
    </div>


  )
}
