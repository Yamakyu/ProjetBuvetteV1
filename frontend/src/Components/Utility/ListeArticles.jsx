import React, { useContext, useState } from 'react'
import Article from './Article'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext';

export default function ListeArticles(props) {

    const {activeSession, isUserTokenExpired} = useContext(SessionContext);
    const myAppNavigator = useNavigate();
    const [articleListResult, setArticleListResult] = useState([]);

    useEffect(() => {
        fetch("/api/articles/all",{
            method: "POST",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
            body: JSON.stringify(
                {
                    isOnlyAvailableArticles: null,
                })
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);
            console.log(data.resultArray);

            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }
            setArticleListResult(data.resultArray);
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
        <br/>
        <h3>Liste d'articles : </h3>
        <br/>
        {articleListResult 
            ? articleListResult.map((article) =>
            {
                return(<Article key={article.id} article={article}/>)
            })
            :""}
    </div>
  )
}
