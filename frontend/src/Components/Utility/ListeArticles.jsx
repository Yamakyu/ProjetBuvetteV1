import React from 'react'
import Article from './Article'

export default function ListeArticles(props) {

  let theseArticles = props.articles;
  let apiSearchResponse = props.apiSearchResponse;


  return (
    <div>
        <br/>
        <h2>{apiSearchResponse || " Liste des articles :"}</h2>
        <br/>
        {theseArticles 
            ? theseArticles.map((article) =>
            {
                return(<Article key={article.id} article={article} displayDetailsButton={true}/>)
            })
            :""}
    </div>
  )
}
