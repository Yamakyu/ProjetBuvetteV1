import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import Article from '../Utility/Article';

export default function ToggleArticle() {

    const { activeSession, isUserTokenExpired } = useContext(SessionContext);
    const { id } = useParams();
    const articleId = parseInt(id);

    const myAppNavigator = useNavigate();

    const [article, setArticle] = useState({});
    const [apiResponse, setApiResponse] = useState("");
    const [disableConfirmButton, setDisableConfirmButton] = useState(false)

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
            setArticle(data.article);
          })
          .catch((err) => {
            console.log(err.message);
            console.log(err);
          });    
        
      return () => {}
    }, [])
    
    const apiToggleArticle = async () => {
    
        setApiResponse("Requête envoyée. L'opération peut prendre quelques instants. En attente de la réponse du serveur... ");
        setDisableConfirmButton(true);
    
        await fetch(`/api/articles/edit/${article.id}`,{
          method: "PUT",
          headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
          body: JSON.stringify(
          {
            isDisponible:!article.isDisponible
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
          setArticle(data.updatedArticle);            

          setDisableConfirmButton(false);
        })
        .catch((err) => console.log(err));
      }

  return (
    <div className='BoxSimple'>
      <h1 className='PageName'>Vous pouvez rendre cet article {article.isDisponible ? "non disponible" : "disponible"}</h1>

      <Article
        article={article}
        displayGoBackButton
        apiResponse
        displayToggleArticleButton
        disableConfirmButton = {disableConfirmButton}
        backEndAPIRequest = {apiToggleArticle}
      />
        
    </div>
  )
}
