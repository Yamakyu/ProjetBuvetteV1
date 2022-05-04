import "./App.css";
import { useState } from "react";
import { SessionContext } from "./Contexts/SessionContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Accueil from "./Components/Accueil";
import Connexion from "./Components/Connexion";
import TestDivers from "./Components/Utility/TestDivers";
import AdminMain from "./Components/PagesAdmin/AdminMain";
import GestionMateriel from "./Components/PagesMateriel/GestionMateriel";
import GestionBuvette from "./Components/PagesBuvette/GestionBuvette";
import AjouterArticle from "./Components/PagesBuvette/AjouterArticle";
import GestionArticles from "./Components/PagesBuvette/GestionArticles";
import ModifierArticle from "./Components/PagesBuvette/ModifierArticle";
import NouvelleCommande from "./Components/PagesBuvette/NouvelleCommande";
import VerifierCommande from "./Components/PagesBuvette/VerifierCommande";
import GestionUtilisateurs from "./Components/PagesAdmin/GestionUtilisateurs";
import AjouterUtilisateur from "./Components/PagesAdmin/AjouterUtilisateur";
import ModifierUtilisateur from "./Components/PagesAdmin/ModifierUtilisateur";
import HistoriqueCommandes from "./Components/PagesBuvette/HistoriqueCommandes";
import DetailCommande from "./Components/PagesBuvette/DetailCommande";
import FinCommande from "./Components/PagesBuvette/FinCommande";

function App() {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [fullUserList, setFullUserList] = useState([]);

  let isUserTokenExpired = (apiResponseData) => {
    //Si le backend retourne que le token est expiré, on vide la session actuelle (removeItem) et on y ajoute le message (le backend retourne l'erreur : la plupart du temps, Token expiré).
    /*
    Afin que la déconnexion soit complète (session vidée + retour à la page de login, le code qui appelle cette fonction doit toujours être :
    if (isUserTokenExpired(apiResponseData)){
      myAppNavigator("/login");       //Avec le useNavigate → const myAppNavigator = useNavigate();

      }
    */
    if (apiResponseData.needLogout) {
      try {
        localStorage.removeItem("currentSession");
        setActiveSession({
          userInfo: {},
          userToken: "",
          userConnexionStatus: apiResponseData.message,
        });
      } catch (error) {
        console.log(
          `Tried to empty an already empty session. Returning empty session`
        );
        console.log(error);
        setActiveSession({
          userInfo: {},
          userToken: "",
          userConnexionStatus:
            "Token invalide ou expiré. Veuillez vous reconnecter",
        });
      }

      console.log("statut de ActiveSession :");
      console.log(activeSession);

      setCurrentOrder([]);
      return true;
    } else {
      return false;
    }
  };

  let getLocalStorage = (localStorageKey) => {
    if (
      localStorage.getItem(localStorageKey) === null ||
      !localStorage.getItem(localStorageKey)
    ) {
      console.log("session is null, returning empty session");
      return {
        userInfo: {},
        userToken: "",
        userConnexionStatus: "",
      };
    } else {
      try {
        console.log("session found, returning session");
        return JSON.parse(localStorage.getItem(localStorageKey));
      } catch (error) {
        console.log(
          `Impossible de trouver la clé de localStorage ${localStorageKey}`
        );
        console.log(error);
        return {
          userInfo: {},
          userToken: "",
          userConnexionStatus: "",
        };
      }
    }
  };

  //Si on a une session dispo dans le localStorage, on l'utilise comme activeSession, sinon on a une session vide.
  const [activeSession, setActiveSession] = useState(
    getLocalStorage("currentSession")
  );

  //↑ On rend les informations de la session accessible dans toute l'application ↓

  return (
    <SessionContext.Provider
      value={{
        activeSession,
        setActiveSession,
        getLocalStorage,
        isUserTokenExpired,
        currentOrder,
        setCurrentOrder,
        fullUserList,
        setFullUserList,
      }}
    >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Connexion />} />
          <Route path="/admin" element={<AdminMain />} />
          <Route path="/manage/buvette" element={<GestionBuvette />} />
          <Route
            path="/manage/buvette/orders/new"
            element={<NouvelleCommande />}
          />
          <Route
            path="/manage/buvette/orders/check"
            element={<VerifierCommande />}
          />
          <Route
            path="/manage/buvette/orders/completed"
            element={<FinCommande />}
          />
          <Route
            path="/manage/buvette/articles/add"
            element={<AjouterArticle />}
          />
          <Route
            path="/manage/buvette/articles/overview"
            element={<GestionArticles />}
          />
          <Route
            path="/manage/buvette/articles/:id"
            element={<ModifierArticle />}
          />
          <Route
            path="/manage/buvette/invoices"
            element={<HistoriqueCommandes />}
          />
          <Route
            path="/manage/buvette/invoices/details/:id"
            element={<DetailCommande />}
          />
          <Route path="/manage/materiel" element={<GestionMateriel />} />
          <Route path="/manage/users" element={<GestionUtilisateurs />} />
          <Route path="/manage/users/add" element={<AjouterUtilisateur />} />
          <Route path="/manage/users/edit" element={<ModifierUtilisateur />} />
          <Route path="/test" element={<TestDivers />} />
        </Routes>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}

export default App;
