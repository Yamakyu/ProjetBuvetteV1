import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContext } from "./Contexts/SessionContext";
import Navbar from "./Components/Navbar";
import Connexion from "./Components/Connexion";
import { useState } from "react";
import AdminMain from "./Components/PagesAdmin/AdminMain";
import GestionBuvette from "./Components/PagesBuvette/GestionBuvette";
import GestionMateriel from "./Components/PagesMateriel/GestionMateriel";
import Accueil from "./Components/Accueil";
import GestionUtilisateurs from "./Components/PagesAdmin/GestionUtilisateurs";
import AjouterUtilisateur from "./Components/PagesAdmin/AjouterUtilisateur";
import UserForm from "./Components/Utility/UserForm";

function App() {
  let getLocalStorage = (localStorageKey) => {
    if (localStorage.getItem(localStorageKey) != null) {
      return JSON.parse(localStorage.getItem(localStorageKey));
    } else {
      console.log(
        `Impossible de trouver la clé de localStorage ${localStorageKey}`
      );
    }
  };

  //Si on a une session dispo dans le localStorage, on l'utilise comme activeSession, sinon on a une session vide.
  let [activeSession, setActiveSession] = useState(
    getLocalStorage("currentSession")
      ? getLocalStorage("currentSession")
      : {
          userInfo: {},
          userToken: "",
        }
  );

  //↑ On rend les informations de la session accessible dans toute l'application ↓

  return (
    <SessionContext.Provider
      value={{ activeSession, setActiveSession, getLocalStorage }}
    >
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/admin" element={<AdminMain />} />
          <Route path="/manage/buvette" element={<GestionBuvette />} />
          <Route path="/manage/materiel" element={<GestionMateriel />} />
          <Route path="/manage/users" element={<GestionUtilisateurs />} />
          <Route path="/manage/users/add" element={<AjouterUtilisateur />} />
          <Route path="/test" element={<UserForm />} />
        </Routes>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}

export default App;
