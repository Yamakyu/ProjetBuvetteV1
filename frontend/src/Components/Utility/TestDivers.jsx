import React, {  useState, useContext } from 'react'
import Article from "./Article"
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext'

export default function TestDivers() {

    const {activeSession, isUserTokenExpired}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

    const [thatImage, setThatImage] = useState("");
    const [thatArticle, setThatArticle] = useState({});
    const [thatArticleImage, setThatArticleImage] = useState();

    //-------------------------------

    const [title, setTitle] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [published, setPublished] = useState(true)
    const [image, setImage] = useState('')


    //-------------------------------
    const formData = new FormData()

    const addProductHandler = async (e) => {

        e.preventDefault()

        // const data = {
        //     title: title,
        //     price: price,
        //     description: description,
        //     published: published
        // }


        //const formData = new FormData()

        formData.append('file', image)
        formData.append('nom', title)
        formData.append('price', price)
        formData.append('description', description)
        formData.append('published', published)


        await axios.post('/api/test/upload', formData, {
            headers: {
                Authorization: "Bearer " + activeSession.userToken
            }
        }).then((res) => {
            console.log(res.data.message);
            console.log(res.data.image);
            if (isUserTokenExpired(res.data)){
                return myAppNavigator("/login");
            }
        })
        .catch((err) => {
            console.log(err);
            console.log(err.message);
            if (isUserTokenExpired(err)){
                return myAppNavigator("/login");
            }
        })

    }

    const fetchArticle = async () => {
        
        await fetch(`/api/test/article/13`,{
            method: "GET",
            headers:{"Content-type" : "application/json", "authorization" : `Bearer ${activeSession.userToken}`},
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("API response ↓");
            console.log(data.message);
            
            if (isUserTokenExpired(data)){
                myAppNavigator("/login");
            }
            
            setThatArticle(data.article);
            console.log(data.article);
            setThatImage("http://" + data.ip + "/images/"+ data.article.photo);      //Permet d'avoir l'image avec l'ip du backend, pour utilisation sur le réseau
            console.log(thatImage);
        })
        .catch((err) => console.log(err));      
    }
    
    
    const displayImage = () => {
        console.log(thatImage);
        //setThatArticleImage(<img src={`http://${thatImage}`}/>);
        setThatArticle(() => ({
            ...thatArticle, image : thatImage
        }))
        setThatArticleImage(<img src={thatImage}/>);
    }
    
    return (
        <div>

        <button onClick={fetchArticle}>Récupérer l'article</button>
        <button onClick={displayImage}>Afficher l'image de l'article</button>

        {thatArticleImage} 
            <Container className='mt-5 p-2'>
                <h1>Add Product</h1>
                <hr />

                <Form onSubmit={addProductHandler} method="POST" encType='multipart/form-data'>

                <Form.Group controlId="fileName" className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                        type="file"
                        name='image'
                        onChange={(e) => setImage(e.target.files[0])}
                        size="lg" />
                </Form.Group>

                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                          />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price ($)</Form.Label>
                        <Form.Control
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                             />
                    </Form.Group>

                  
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            as="textarea"
                            />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="publishedCheckedid">
                        <Form.Check
                            type="checkbox"
                            onChange={(e) => setPublished(e.target.checked)}
                            label="publish"
                           />
                    </Form.Group>


                    <Button variant="primary" type="submit">
                        Add Product
                    </Button>
                </Form>
            </Container>



        <Article product={thatArticle}/>
    </div>
  )
}
