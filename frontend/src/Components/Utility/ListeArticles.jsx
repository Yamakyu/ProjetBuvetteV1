import React from 'react'
import Article from './Article'

export default function ListeArticles(props) {

  let theseArticles = props.articles;

  let apiSearchResponse = props.apiSearchResponse;
  let addToOrder = props.addToOrderChild;

  let displayAddToOrderButton = props.displayAddToOrderButtonChild; 
  let displayDetailsButton = props.displayDetailsButtonChild;

  return (
    <div>

        <h2>{apiSearchResponse || " Liste des articles :"}</h2>
        {theseArticles 
          ? theseArticles.map((article) =>{
            return(
              <Article key={article.id} 
                article={article} 
                displayDetailsButton={displayDetailsButton}
                displayAddToOrderButton={displayAddToOrderButton}
                addToOrder={addToOrder}
                />
            )
          })
          :""}
    </div>
  )
}
