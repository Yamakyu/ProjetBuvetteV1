import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function MiniArticle(props) {

    let myAppNavigator = useNavigate();

    let article = props.article;
    let isOrdering = props.isOrdering;
    let addToOrder = props.addToOrder;


  return (
    <div className={article.isDisponible ? 'MiniArticleCard' : "MiniArticleCardUnavailable"}>
        
        <div className='MiniCardContent'>
            <img className='MiniCardPhoto' src={article.photo}/>  
            <div className='MiniCardInfo'>
                <h2>{article.nom} </h2>
                <div className='MiniCardDescription'>
                    <i>{article.description ? `"${article.description}"` : ""}</i> 
                </div>
            </div>
        </div>
        <div style={{fontSize:"16px"}}>
            <br />
            Catégorie : {article.categorie} || {article.isDisponible ? <b>{article.prixUnitaire} €</b> : <u>Non disponible</u>}
        </div>
        <div >
            </div> 
    
        <div className='MiniCardButtonContainer'>
            <button className='MiniCardSubButton' hidden={isOrdering} onClick={() => myAppNavigator(`/manage/buvette/articles/${article.id}`)}>Modifier</button> 
            <button className='MiniCardConfirmButton' hidden={!isOrdering || !article.isDisponible} onClick={() => addToOrder(article)}>Ajouter à la commande</button> 
            <button className={article.isDisponible ? "MiniCardCancelButton" : "MiniCardConfirmButton"} hidden={isOrdering} onClick={() => myAppNavigator("/manage/buvette/articles/toggle/"+article.id)}>Rendre {article.isDisponible ? "non disponible" : "disponible"}</button>
        </div>
    </div>
  )
}
