import Button from '@restart/ui/esm/Button'
import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Article = ({ product }) => {

    //product.description="ptain"

    return (
        <>
        <br/>
            <Card className='shadow-lg m-2 p-3 rounded' style={{ width: '18rem' }}>
                <Card.Img src={product.image} height="200" />
                <Card.Body> 
                    <Card.Title>Title: {product.nom}</Card.Title>
                    <Card.Title>Price: ${product.prixUnitaire}</Card.Title>
                    <Card.Text>
                        Description: {product.description}
                    </Card.Text>
                 
                    <Link to={`product/${product.id}`}>
                        <Button>Detail</Button>
                    </Link>
                </Card.Body>
            </Card>
        </>
    )
}

export default Article
