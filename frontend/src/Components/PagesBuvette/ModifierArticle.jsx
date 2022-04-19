import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SessionContext } from '../../Contexts/SessionContext'
import Article from '../Utility/Article';

export default function ModifierArticle() {

    const myAppNavigator = useNavigate();
    const {activeSession, isUserTokenExpired} = useContext(SessionContext);
    const { id } = useParams();
    const articleId = parseInt(id);
    const [thatArticle, setThatArticle] = useState("");

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
        })
        .catch((err) => {
            console.log(err.message);
            console.log(err);
        });    
    
      return () => {
        //
      }
    }, [])


  return (
      <div>
        <h1>
            Yo, article {articleId}
        </h1>
        <h3>
            <Article article={thatArticle} displayDetailsButton={false}/>
        </h3>
      </div>
  )
}
