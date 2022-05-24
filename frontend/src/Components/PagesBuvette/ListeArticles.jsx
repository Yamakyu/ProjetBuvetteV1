import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';
import Article from '../Utility/Article'
import MiniArticle from '../Utility/MiniArticle';

export default function ListeArticles(props) {

  let theseArticles = props.articles;

  let apiSearchResponse = props.apiSearchResponse;
  let addToOrder = props.addToOrderChild;

  let displayAddToOrderButton = props.displayAddToOrderButtonChild; 
  let displayDetailsButton = props.displayDetailsButtonChild;
  let displayToggleArticleButton = props.displayToggleArticleButtonChild;  



  return (
    <div className='BoxSimple'>

        <h2>{apiSearchResponse || " Liste des articles :"}</h2>
        {theseArticles 
          ? theseArticles.map((article) =>{
            return(
              <MiniArticle 
                key={article.id} 
                article={article} 
                displayDetailsButton={displayDetailsButton}
                displayAddToOrderButton={displayAddToOrderButton}
                addToOrder={addToOrder}
                displayToggleArticleButton={displayToggleArticleButton}
                displayGoBackButton
              />
            )
          })
          :""}
    </div>
  )
}
