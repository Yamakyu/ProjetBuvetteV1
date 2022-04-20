import Button from '@restart/ui/esm/Button'
import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Article(props) {

    let article = props.article;
    let displayDetailsButton = props.displayDetailsButton; 
    let isEditingArticle = props.isEditingArticle;
    let newArticle = props.newArticle;

    const myAppNavigator = useNavigate();

    return (
        <>
        <br/>
            <Card className='shadow-lg m-2 p-3 rounded' style={{ width: '60rem' }}>
                <Card.Img src={article.photo} height="100" />
                <Card.Body> 
                    <Card.Title>Nom de l'article : {article.nom}
                        {(isEditingArticle && (newArticle.nom !== article.nom)) 
                            ? <> → <b>{newArticle.nom}</b> </>
                            : ""}
                    </Card.Title>
                    
                    <Card.Title>Prix unitaire: {article.prixUnitaire}€
                        {(isEditingArticle && (newArticle.prixUnitaire !== article.prixUnitaire)) 
                            ? <> → <b>{newArticle.prixUnitaire}€</b> </>
                            : ""}
                    </Card.Title>
                    
                    <Card.Title>Disponible : {article.isDisponible ? "oui" : "non" }
                        {(isEditingArticle && (newArticle.isDisponible !== article.isDisponible)) 
                            ? <> → <b>{newArticle.isDisponible}</b> </>
                            : ""}
                    </Card.Title> 
                    
                    <Card.Text >Description: {article.description}
                    <br/>
                        {(isEditingArticle && (newArticle.description !== article.description)) 
                            ? <> → <b>{newArticle.description}</b> </>
                            : ""}
                    </Card.Text>    
                    
                    {displayDetailsButton
                        ? <Button onClick={() => myAppNavigator(`/manage/buvette/articles/${article.id}`)}>Details</Button>
                        : ""}
                </Card.Body>
            </Card>
        </>
    )
}
