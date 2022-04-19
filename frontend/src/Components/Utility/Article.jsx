import Button from '@restart/ui/esm/Button'
import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Article(props) {

    let article = props.article;
    let displayDetailsButton = props.displayDetailsButton && true;
    const myAppNavigator = useNavigate();

    return (
        <>
        <br/>
            <Card className='shadow-lg m-2 p-3 rounded' style={{ width: '60rem' }}>
                <Card.Img src={article.image} height="50" />
                <Card.Body> 
                    <Card.Title>Nom de l'article : {article.nom}</Card.Title>
                    <Card.Title>Prix unitaire: ${article.prixUnitaire}</Card.Title>
                    <Card.Title>Disponible : {article.isDisponible ? "oui" : "non" } </Card.Title>
                    <Card.Text >Description: {article.description}</Card.Text>
                        
                        {displayDetailsButton
                            ? <Button onClick={() => myAppNavigator(`/manage/buvette/articles/${article.id}`)}>Details</Button>
                            : ""}
                </Card.Body>
            </Card>
        </>
    )
}
