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

    const [userListResult, setUserListResult] = useState([]);

    //const [isEditingUser, setisEditingUser] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [listUserDisplay, setListUserDisplay] = useState("");
    const [isFilteredList, setIsFilteredList] = useState(false);
    const [disableInput, setDisableInput] = useState(true);
    const [searchTool, setSearchTool] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [originalUser, setOriginalUser] = useState(null);
    
//------------------------------------------------------------------------- USE EFFECT

    //Au chargement de la page
    useEffect(() => {

        if(userListResult.length===0){
            setApiResponse("Veuillez rafraichir la page");
        }

        if (activeSession){
            apiGetAllUsers();
            
        } else {
            setActiveSession({
                userConnexionStatus:"Acc??s r??serv??. Veuillez vous connecter."
            })
            myAppNavigator("/login");
        }

        setUserWorkedOn({
            nom:"",
            prenom:"",
            email:"",
            password:"",
            droits:"Aucun",
            isActiveAccount:true
        })      
        /* ??? Afin de parer ?? l'??ventualit?? o?? l'utilisateur revient de la page d'??dition/suppression utilisateur, on reset
        userWorkedOn, ce qui emp??chera d'afficher les informations la prochaine fois que l'utilisateur d??cide d'ajouter un 
        nouvel utilisateur. Ainsi, la formulaire d'ajout ne sera pas pr??-rempli avec des informations d'un utilisateur existant.
        La m??me op??ration est r??alis??e dans GestionUtilisateurs.jsx */
            

      return () => {
        //cleanup
      }
    }, []);

    //?? chaque mise ?? jour de la liste des r??sultats
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
                //Cette expression conditionelle permet de masquer les bool??ens (isAdmin, etc), le mot de passe et les dates de cr??ation/update
                objectKey.startsWith("is") || objectKey === "password" || objectKey.startsWith("crea") || objectKey.startsWith("upda")
                ? ""
                : <li key={objectKey}> {objectKey} :  
                {
                    originalUser                                //??? Vide ou null si on est pas en train de modifier un utilisateur
                    ? value !== originalUser[objectKey]         //SI on modifie la valeur (par exemple, si on modifie le nom)
                        ? ` ${originalUser[objectKey]} ---??? `    //ALORS affichage de l'ancienne valeur ?? c??t?? de la nouvelle (= value)
                        : ""
                    : ""
                } {value} </li>
                /*??? originalUser est vide sauf si on fait une modification d'utilisateur. 
                Le cas ??ch??ant, SI l'ancienne valeur d'une propri??t?? (par exemple, le nom) est chang??e alors on affiche l'ancienne valeur et la nouvelle. Sinon, on affiche seulement la "nouvelle" valeur (qui est inchang??e)
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
                                //Pour ??viter des accidents, l'admin connect?? n'est pas affich?? dans la liste des utilisateurs modifiables.
                                if(user.id === activeSession.userInfo.id) {
                                    return "";
                                }else{
                                    return(
                                        <li key={objectKey}> {user.nom} {user.prenom} // {user.email} // Droits : {parseUserRights(user)} 
                                        {user.isActiveAccount
                                        ? " ??? " 
                                        : " |||| <COMPTE INACTIF> ??? " } 
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
                                //Pour ??viter des accidents, l'admin connect?? n'est pas affich?? dans la liste des utilisateurs modifiables.
                                if(user.id === activeSession.userInfo.id) {
                                    return "";
                                }else{
                                    return(
                                        <MiniUtilisateur 
                                            key={objectKey} 
                                            user={user}
                                            goToToggleUser={goToToggleUser}
                                            goToEditUser={goToEditUser}
                                        /> 
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
        //submitForm est appel?? par le composant userForm.jsx

        formEvent.preventDefault();
        setApiResponse("");
        
        if (isEditingPassword && !disableInput && (passwordConfirm !== userWorkedOn.password)){
            setWarning("ATTENTION. La confirmation de mot de passe doit ??tre identique au mot de passe entr?? !");
            //setIsDoubleChecking(false);
            setCheckEditUser("");
            setConfirmButton("");
            setWarningUserDelete("");
        } else {
            setWarning("R??sum?? des modification :");
            setConfirmButton(<button onClick={() => apiEditUser(userWorkedOn)}>Confirmer la modification ? </button>);
            setCheckEditUser(displayInputedUser(userWorkedOn));
            setWarningUserDelete("");
        }
        console.log(userWorkedOn);
    }

//------------------------------------------------------------------------- METHODES DE PR??PARATON DE REQU??TE

    let checkInactiveAccounts = false;

    const handleInputSelect = (inputEvent) => {
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
                Rechercher un utilisateur dont le nom ou pr??nom est : {" "}

                <input
                placeholder='Nom ou pr??nom'
                value={nameToLookFor}
                type="text"
                onChange={(e) => nameToLookFor = e.target.value}
                name="searchName"
                />
                <br/>
               
                Inclure les utilisateurs inactifs (supprim??s) ?
                <input type="checkbox" defaultChecked={false} value={checkInactiveAccounts} onChange={() => checkInactiveAccounts = !checkInactiveAccounts}/>

                <button onClick={() => apiSearchUsersByName(nameToLookFor, checkInactiveAccounts)}>Valider</button>
            </div>
        );
    }

    const prepareSearchUserByRole = () => {
        let roleToLookFor = "Aucun";
        resetWarning();
        setDisableInput(true);
        setCheckEditUser("");
        
        setSearchTool(
            <div>
                <label>
                    Rechercher un utilisateur ayant les droits de gestion suivants : {" "}
                    <select onChange={(e) => roleToLookFor = e.target.value}>
                        <option value="Aucun">Aucun</option>
                        <option value="Gerant Buvette">G??rant de buvette</option>
                        <option value="Gerant Mat??riel">G??rant mat??riel</option>
                        <option value="Double g??rant">Double g??rant</option>
                        <option value="Admin">Administrateur</option>
                    </select>
                </label>
                <br/>
                Inclure les utilisateurs inactifs (supprim??s) ?
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
               
                Inclure les utilisateurs inactifs (supprim??s) ?
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
        
        //Si l'utilisateur veut activer/d??sactiver un compte, on ??vite de lui laisser la possibilit?? de modifier d'autres ??l??ments du compte
        setDisableInput(true);

        setWarning("");
        if(userSelected.isActiveAccount){
            setApiResponse("");
        }else{
            setApiResponse(" Cet utilisateur est actuellement INACTIF. En validant vous confirmez vouloir le r??activer. ");
        }

        setUserWorkedOn(() => ({
            ...userSelected,
            droits: parseUserRights(userSelected)
        }));

        setConfirmButton(<button onClick={() => apiChangeUserActivation(userSelected)}>Confirmer la {userSelected.isActiveAccount ? "suppression" : "r??activation"}</button>);
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
        //??? On aura besoin d'avoir une trace des informations utilisateur originelles
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


//------------------------------------------------------------------------- METHODES DE TRAITEMENT et REQU??TES

    //Dans la BdD les droits sont des bool??ens, on parse ceci.
    const parseUserRights = (thatUser) => {
        if (thatUser.isAdmin){
            return "Admin";
        }else if (thatUser.isGerantBuvette && thatUser.isGerantMateriel){
            return "Double g??rant";
        }else if (!thatUser.isGerantBuvette && !thatUser.isGerantMateriel) {
            return "Aucun";
        }else {
            return thatUser.isGerantBuvette 
            ? "Gerant Buvette"
            : "Gerant Mat??riel"
        };
    }
    
    const apiChangeUserActivation = async (thatUser) => {
        setApiResponse("Requ??te envoy??e. L'op??ration peut prendre quelques secondes. En attente de la r??ponse du serveur... ");
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
            console.log("API response ???");
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
        //Cette expression permet de *remplacer* un objet dans un array qui contient des objets. Inspir?? du lien ci dessus
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
            console.log("API response ???");
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
            console.log("API response ???");
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
            console.log("API response ???");
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
        
        setApiResponse("Requ??te envoy??e. L'op??ration peut prendre quelques secondes. En attente de la r??ponse du serveur... ");
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
            console.log("API response ???");
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

    //Appel?? uniquement quand on charge (ou) refresh la page
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
                console.log("API response ???");
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
                    <option value="name"> Rechercher par nom ou pr??nom </option>
                    <option value="email"> Rechercher par adresse e-mail </option>
                    <option value="droits"> Rechercher par droits</option>
                </select>
            </label>
        </h3>
        {searchTool}
        <hr className='FancyHr'/>
        <h1>{apiSearchResponse || " Liste de tout les utilisateurs :"}</h1>
        {/*Par d??faut on affiche "liste de tout les utilisateurs, mais quand on fait des recherches on 
        va plut??t  afficher "R??sultats de la recherche", qui est donn?? en r??ponse de l'API Fetch.
        cf setApiSearchResponse() */}   
        {listUserDisplay ||  " ---- affichage de la liste des utilisateurs" }
    </div>


  )
}
