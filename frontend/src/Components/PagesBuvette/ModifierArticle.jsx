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

  const handleEditForm = inputEvent => {
    const { name, value, files } = inputEvent.target;

    setApiResponse("");

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

//------------------------------------------------------------------------- METHODES DE TRAITEMENT et REQUÊTES

  const apiEditArticle = async () => {
    
    setApiResponse("Requête envoyée. L'opération peut prendre quelques instants. En attente de la réponse du serveur... ");
    setConfirmButton("");
    setCancelButton("");
    setIsCurrentlyEditingArticle(false);

    let areArticlesEqual = false;

    for(let key in articleWorkedOn){
      if((thatArticle[key]!==articleWorkedOn[key]) || (key === "file" && articleWorkedOn[key] !== undefined)){
        areArticlesEqual = false;
      } else {
        areArticlesEqual = true;
      }
      if (!areArticlesEqual){
        break;
      }
    }
    
    console.log(areArticlesEqual);
    
    if(areArticlesEqual){
      setApiResponse("Vous n'avez entré aucune modification")
      return;
    }

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
        setArticleWorkedOn(res.data.updatedArticle);
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
    console.log(thatArticle);
    console.log(thatArticle.prixUnitaire == articleWorkedOn.prixUnitaire);
    console.log(thatArticle.prixUnitaire != articleWorkedOn.prixUnitaire);
    console.log(articleWorkedOn.file);
  }

  return (
    <div>
      <DoTheThings
        theThing = {doThething}
        theOtherThing={null}
      />
      <h1 className='PageName'> Article #{articleId}</h1>

      <div className='BoxSimple'>
        
          <Article 
            article={thatArticle} 
            newArticle={articleWorkedOn}
            apiResponse={apiResponse}
            isEditingArticle
            dispplayEditArticleButton
            displayGoBackButton

            setIsArticlesEqual
            isArticlesEqual
            
            handleEditForm={handleEditForm}
            backEndAPIRequest = {apiEditArticle}
          />
        
        <br/>
        <br/>
      </div>
    </div>
  )
}
