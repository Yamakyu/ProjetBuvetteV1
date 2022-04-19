import Button from '@restart/ui/esm/Button'
import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Article = ({ article }) => {

    return (
        <>
        <br/>
            <Card className='shadow-lg m-2 p-3 rounded' style={{ width: '18rem' }}>
                <Card.Img src={article.image} height="200" />
                <Card.Body> 
                    <Card.Title>Title: {article.nom}</Card.Title>
                    <Card.Title>Price: ${article.prixUnitaire}</Card.Title>
                    <Card.Text>
                        Description: {article.description}
                    </Card.Text>
                 
                    <Link to={`article/${article.id}`}>
                        <Button>Detail (not functional)</Button>
                    </Link>
                </Card.Body>
            </Card>
        </>
    )
}

export default Article
