import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SessionContext } from '../../Contexts/SessionContext'
import { Container, Form, Button } from 'react-bootstrap'
import Article from '../Utility/Article';
import axios from 'axios'
import DoTheThings from '../Utility/DoTheThings'



export default function ModifierArticle() {

//------------------------------------------------------------------------- INITIALISATION

  const myAppNavigator = useNavigate();
  const {activeSession, isUserTokenExpired} = useContext(SessionContext);
  const { id } = useParams();
  const articleId = parseInt(id);

  const [thatArticle, setThatArticle] = useState({});
  const [articleWorkedOn, setArticleWorkedOn] = useState({
    nom:"",
    description:"",
    prixUnitaire:"",
    categorie:"",
    file:"",
  });

  const [apiResponse, setApiResponse] = useState("");
  const [confirmButton, setConfirmButton] = useState("");
  const [cancelButton, setCancelButton] = useState("");
  const [isCurrentlyEditingArticle, setIsCurrentlyEditingArticle] = useState(false);


//------------------------------------------------------------------------- USE EFFECT

  useEffect(() => {
    
    fetch("/api/articles/"+articleId,{
      method: "GET",
      headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
        
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("API response ↓");
      console.log(data.message);
      console.log(data.article);

      if (isUserTokenExpired(data)){
        myAppNavigator("/login");
      }
      setThatArticle(data.article);
      setArticleWorkedOn(data.article);
    })
    .catch((err) => {
      console.log(err.message);
      console.log(err);
    });    
  
    return () => {
      //
    }
  }, [])

//------------------------------------------------------------------------- METHODES DE PRÉPARATON DE REQUÊTE

  const prepareToggleArticle = () => {
    setApiResponse(` Cet article ${thatArticle.isDisponible ? "ne sera PLUS DISPONIBLE" : "sera de nouveau DISPONIBLE"} dans la buvette. Vous pourrez de nouveau changer ce statut à volonté.`);
    setConfirmButton(<button onClick={apiChangeArticleActiveState}> Confirmer la modification ? </button>);
    setCancelButton(<button onClick={cancelModification}> Annuler l'opération </button>);
    setIsCurrentlyEditingArticle("");
  }

  const prepareEditArticle = () => {    
    setApiResponse("")
    setArticleWorkedOn(thatArticle);
    
    setConfirmButton("");   //L'affichage du bouton de confirmation (pour l'édition est géré par isCurrentlyEditingArticle)
    setIsCurrentlyEditingArticle(true);
    setCancelButton(<button onClick={cancelModification}> Annuler l'opération </button>);
  }

  const handleEditForm = inputEvent => {
    const { name, value, files } = inputEvent.target;

    if (name !== "image"){
      setArticleWorkedOn(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      console.log(files[0]);
      setArticleWorkedOn(prevState => ({
        ...prevState,
        file: files[0]
      }));
    }
  }

  const cancelModification = () =>  {
    setCancelButton("");
    setConfirmButton("");
    setApiResponse("");
    setIsCurrentlyEditingArticle(false);
  }

//------------------------------------------------------------------------- METHODES DE TRAITEMENT et REQUÊTES

  const apiChangeArticleActiveState = async () => {
    
    setApiResponse("Requête envoyée. L'opération peut prendre quelques instants. En attente de la réponse du serveur... ");
    setConfirmButton("");
    setCancelButton("");

    await fetch(`/api/articles/edit/${thatArticle.id}`,{
      method: "PUT",
      headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
      body: JSON.stringify(
      {
        isDisponible:!thatArticle.isDisponible
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
      setThatArticle(data.updatedArticle);            
    })
    .catch((err) => console.log(err));
  }

  const apiEditArticle = async () => {
    
    setApiResponse("Requête envoyée. L'opération peut prendre quelques instants. En attente de la réponse du serveur... ");
    setConfirmButton("");
    setCancelButton("");
    setIsCurrentlyEditingArticle(false);

    const formData = new FormData();
    
    formData.append('nom', articleWorkedOn.nom);
    formData.append('prixUnitaire', articleWorkedOn.prixUnitaire);
    formData.append('categorie', articleWorkedOn.categorie);
    formData.append('description', articleWorkedOn.description);
    
    //Pour éviter d'écraser l'image (qui n'est pas contrôlé de la même manière que le reste de articleWorkedOn), on ne l'ajoute que si on l'a changé. Autrement on risque d'ajouter une adresse vide à l'article (qui va être interceptée par le middleware)
    if (articleWorkedOn.file !== null || articleWorkedOn.file !== undefined || articleWorkedOn.file.replace(/\s+/g, '') !== ""){
      formData.append('file', articleWorkedOn.file);
    }
    
    await axios.put('/api/articles/edit/'+thatArticle.id, formData, {
      headers: {
        Authorization: "Bearer " + activeSession.userToken
      }
    }).then((res) => {
      console.log("API response ↓");
      console.log(res.data.message);
      console.log(res.data);

      if (isUserTokenExpired(res.data)){
        return myAppNavigator("/login");
      }else{
        setApiResponse(res.data.message);
        setThatArticle(res.data.updatedArticle)
      }
    })
    .catch((err) => {
      console.log("API response ↓");
      console.log(err.response.data.message);
      console.log(err);
      if (isUserTokenExpired(err.response.data)){
        return myAppNavigator("/login");
      }
      setApiResponse(err.response.data.message);
    })
  }

//------------------------------------------------------------------------- AFFICHAGE

  const doThething = () => {
    console.log(articleWorkedOn);
  }

  return (
    <div>
      
      <DoTheThings
        theThing = {doThething}
        theOtherThing={null}
      />
      <h1 className='PageName'> Article #{articleId}</h1>

      <div className='BoxSimple'>

      <div className='APIResponse'>
          {apiResponse || ""}
        </div>

        <div>
          <Article 
            article={thatArticle} 
            newArticle={articleWorkedOn}
            isEditingArticle
            dispplayEditArticleButton
            displayGoBackButton
            handleEditForm={handleEditForm}
            backEndAPIRequest = {apiEditArticle}
            />
        </div>
        <br/>
        <br/>
      </div>


    </div>
  )
}
