import React, {  useState, useContext } from 'react'
import Article from "../Utility/Article"
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext'


export default function AjouterArticle() {

    const {activeSession, isUserTokenExpired}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

    const [articleName, setArticleName] = useState("");
    const [articlePrice, setArticlePrice] = useState(0);
    const [articleDescription, setArticleDescription] = useState("");
    const [isArticlePublished, setIsArticlePublished] = useState(true);
    const [articleImage, setArticleImage] = useState("");
    const [validateArticle, setValidateArticle] = useState("");
    const [formMessage, setFormMessage] = useState("");
    const [resAPIMessage, setResAPIMessage] = useState("");
    const [validationMessage, setvalidationMessage] = useState("");


    const displayInputedArticle = (article) => {
        console.log(article);
        return(
            <ul>
                {Object.entries(article).map(([objectKey, value]) =>
                objectKey.startsWith("file")
                ? ""
                : <li key={objectKey}> {objectKey} : { value } </li>   
                )}
                <br/>
                <button onClick={apiAddArticle}>→ Ajouter l'article ←</button>
            </ul>
        );
    }

    const prepareAddArticle = (e) => {
        e.preventDefault();

        let articleWorkedOn = {
            nom: articleName,
            description: articleDescription,
            prix: articlePrice,
            file: articleImage,
            disponible: isArticlePublished ? "oui" : "non"        //← Ici je parse le booléen en "oui" ou "non", pour la vérification
        }
        setResAPIMessage("");
        setValidateArticle(displayInputedArticle(articleWorkedOn))
    }

    const apiAddArticle = async () => {
        const formData = new FormData();

        formData.append('file', articleImage);
        formData.append('nom', articleName);
        formData.append('price', articlePrice);
        formData.append('description', articleDescription);
        formData.append('published', isArticlePublished);

        setResAPIMessage("Ajout en cours. Cela peut prendre quelques instants....");

        await axios.post('/api/articles/add', formData, {
            headers: {
                Authorization: "Bearer " + activeSession.userToken
            }
        }).then((res) => {
            console.log("API response ↓");
            console.log(res.data.message);
            console.log(res.data);

            if (isUserTokenExpired(res.data)){
                return myAppNavigator("/login");
            }else{
                setResAPIMessage("→ Article " + res.data.message);
                setArticleName("");
                setArticlePrice("");
                setArticleDescription("");
                setArticleImage({});
                setValidateArticle("");
            }
        })
        .catch((err) => {
            console.log("API response ↓");
            console.log(err.response.data.message);
            console.log(err);
            if (isUserTokenExpired(err)){
                return myAppNavigator("/login");
            }
            setResAPIMessage(err.response.data.message);
        })
        
    }


  return (
    <div>
        <br/>
        <h1>AJOUTER UN ARTICLE</h1>
        <br/>

        
        <Container className='mt-5 p-2'>
            <hr />
                <Form onSubmit={prepareAddArticle}>

                    <Form.Group controlId="fileName" className="mb-3">
                        <Form.Label>Choississez une photo ou une image </Form.Label>
                        <Form.Control
                            type="file"
                            name='image'
                            onChange={(e) => setArticleImage(e.target.files[0])}
                            size="lg" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Nom de l'article : </Form.Label>
                        <Form.Control
                            value={articleName}
                            onChange={(e) => setArticleName(e.target.value)}
                            type="text"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Prix unitaire (€) : </Form.Label>
                        <Form.Control
                            value={articlePrice}
                            onChange={(e) => setArticlePrice(e.target.value)}
                            type="number"
                            />
                    </Form.Group>

                
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description de l'article</Form.Label>
                        <br/>
                        <Form.Control
                            value={articleDescription}
                            onChange={(e) => setArticleDescription(e.target.value)}
                            as="textarea"
                            />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="publishedCheckedid">
                        <Form.Check
                            type="checkbox"
                            onChange={(e) => setIsArticlePublished(e.target.checked)}
                            label="Article immédiatement disponible ?"
                            defaultChecked={true}
                        />
                    </Form.Group>


                    <Button variant="primary" type="submit">
                        Vérifier la saisie
                    </Button>
                </Form>
            </Container>


        {validateArticle} {resAPIMessage}

        <br/>
        <br/>
        <br/>
        <button onClick={() => myAppNavigator("/manage/buvette/articles/overview")}>Accéder à la liste des articles</button>


    </div>
  )
}
