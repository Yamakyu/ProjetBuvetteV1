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
    const [articleCategory, setArticleCategory] = useState("snack");
    const [isArticlePublished, setIsArticlePublished] = useState(true);
    const [articleImage, setArticleImage] = useState("");
    const [validateArticle, setValidateArticle] = useState("");
    const [formMessage, setFormMessage] = useState("");
    const [apiResponse, setApiResponse] = useState("");
    const [validationMessage, setvalidationMessage] = useState("");


    const displayInputedArticle = (article) => {
        console.log(article);
        return(
            <div className='MiniArticleCardConfirm'>
                {Object.entries(article).map(([objectKey, value]) =>
                objectKey.startsWith("file")
                ? ""
                : <h3 key={objectKey} style={{lineHeight:"4px"}}>  <u>{objectKey}</u> : <b>{value}{objectKey === "prix" ? "€" : ""}</b></h3>   
                )}
                <br/>
                <button className='ConfirmButton' onClick={apiAddArticle}>Ajouter l'article</button>
            </div>
        );
    }

    const prepareAddArticle = (e) => {
        e.preventDefault();
        setApiResponse("");

        if (isStringEmpty(articleName)){
            return setApiResponse("Vous devez remplir au moins le nom de l'article !");
        } else if (articlePrice === 0) {
            setApiResponse("ATTENTION : le prix indiqué est 0€ !");
        }

        let articleWorkedOn = {
            nom: articleName,
            description: articleDescription,
            categorie: articleCategory,
            prix: articlePrice,
            file: articleImage,
            disponible: isArticlePublished ? "oui" : "non"        //← Ici je parse le booléen en "oui" ou "non", pour la vérification
        }
        setValidateArticle(displayInputedArticle(articleWorkedOn))
    }

    const apiAddArticle = async () => {
        const formData = new FormData();

        formData.append('file', articleImage);
        formData.append('nom', articleName);
        formData.append('price', articlePrice);
        formData.append('categorie', articleCategory);
        formData.append('description', articleDescription);
        formData.append('published', isArticlePublished);

        setApiResponse("Ajout en cours. Cela peut prendre quelques instants....");

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
                setApiResponse("→ Article " + res.data.message);
                setArticleName("");
                setArticlePrice("");
                setArticleDescription("");
                setArticleImage({});
                setValidateArticle("");
                setArticleCategory("");
            }
        })
        .catch((err) => {
            console.log("API response (error) ↓");
            console.log(err.response.data.message);
            if (isUserTokenExpired(err.response.data)){
                return myAppNavigator("/login");
            }
            setApiResponse(err.response.data.message);
        })
        
    }

    const isStringEmpty = (thatString) => {
        if (thatString === null || thatString === undefined || thatString === "" || thatString.replace(/\s+/g, '') === ""){
            return true;
        } else {
            return false;
        }
    }


  return (  
    <div className='BoxSimple'>
        <br/>
        <h1>AJOUTER UN ARTICLE</h1>
        <br/>         

            <form onSubmit={prepareAddArticle} className='ArticleCard'>
                <Form>
                    <Form.Group controlId="fileName">
                        <Form.Label className='VerticalLabel'>Photo ou image :</Form.Label> <br />
                        <Form.Control
                            className='LargeInput'
                            type="file"
                            name='image'
                            onChange={(e) => setArticleImage(e.target.files[0])}
                            size="lg" 
                        />
                    </Form.Group>
                    <br />
                    
                    <div className='VerticalLabel'>Nom de l'article : </div>
                    <input
                        className='LargeInput'
                        onChange={(e) => setArticleName(e.target.value)}
                        value={articleName}
                        type="text"
                        name="nom"
                    />

                    <label className='FancyBr'>
                        <div className='VerticalLabel'>
                            Categorie : {" "}
                        </div>
                        <select name="categorie" 
                        className='OptionSelector' onChange={(e) => setArticleCategory(e.target.value)} value={articleCategory}>
                            <option value="snack">Snack</option>
                            <option value="friandise">friandise</option>
                            <option value="boisson chaude">Boisson chaude</option>
                            <option value="boisson fraiche">Boisson fraîche</option>
                            <option value="plat chaud">Plat chaud</option>
                            <option value="plat froid">Plat froid</option>
                        </select>
                    </label>

                    <div className='VerticalLabel'>Prix unitaire (€) : </div>
                    <input
                        className='LargeInput'
                        value={articlePrice}
                        onChange={(e) => setArticlePrice(e.target.value)}
                        type="number"
                        name="prixUnitaire"
                    />
                    <div className='FancyBr'/>

                    <Form.Label>Description de l'article</Form.Label>
                    <br/>
                    <Form.Control
                        className='LargeInput'
                        value={articleDescription}
                        onChange={(e) => setArticleDescription(e.target.value)}
                        as="textarea"
                        name="description"
                    />

                    <Form.Group className="mb-3" controlId="publishedCheckedid">
                        <Form.Check
                            type="checkbox"
                            onChange={(e) => setIsArticlePublished(e.target.checked)}
                            label="Article immédiatement disponible ?"
                            defaultChecked={true}
                        />
                    </Form.Group>
                </Form>
                
                <br className='FancyBr'/>

                <button hidden={false} className='SubButton'>Vérifier la saisie</button>

            {validateArticle}
            </form>


         {apiResponse}

        <br className='FancyBr'/>
        <button className='CancelButton' onClick={() => myAppNavigator("/manage/buvette/articles/overview")}>Liste des articles</button>


    </div>
  )
}
