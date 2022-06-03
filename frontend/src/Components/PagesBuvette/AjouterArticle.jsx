import React, {  useState, useContext } from 'react'
import Article from "../Utility/Article"
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext'


export default function AjouterArticle() {

    const {activeSession, isUserTokenExpired}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

    const [apiResponse, setApiResponse] = useState("");
    const [isValidating, setIsValidating] = useState(false)
    const [articleWorkedOn, setArticleWorkedOn] = useState({
        nom:"",
        description:"",
        prixUnitaire:0,
        categorie:"snack",
        file:"",
        published: true
    });

    const prepareAddArticle = (e) => {
        e.preventDefault();
        setApiResponse("");

        if (isStringEmpty(articleWorkedOn.nom)){
            return setApiResponse("Vous devez remplir au moins le nom de l'article !");
        } else if (articleWorkedOn.prixUnitaire === 0) {
            setApiResponse("ATTENTION : le prix indiqué est 0€ !");
        }

        let newArticle = {
            nom: articleWorkedOn.nom,
            description: articleWorkedOn.description,
            categorie: articleWorkedOn.categorie,
            prix: articleWorkedOn.prixUnitaire,
            file: articleWorkedOn.file,
            disponible: articleWorkedOn.published ? "oui" : "non"        //← Ici je parse le booléen en "oui" ou "non", pour la vérification
        }
        //setValidateArticle(displayInputedArticle(newArticle))
        setIsValidating(true);
    }

    const parseArticle = (objectKey, objectValue) => {
        //: <h3 key={objectKey}>  <u>{objectKey}</u> : <b>{parseArticle(value)}{objectKey === "prixUnitaire" ? "€" : ""}</b></h3>   

        switch (objectKey) {
            case "nom":
                return <div><u>Nom</u> : {objectValue}</div>
            case "categorie":
                return <div><u>Catégorie</u> : {objectValue}</div>
            case "prixUnitaire":
                return <div><u>Prix unitaire</u> : {objectValue}€</div>
            case "description":
                return <div><u>Description</u> : {objectValue}</div>
            case "published":
                return <div><u>Disponible ?</u> : {objectValue === true ? "oui" : "non"}</div>
            default:
                break;
        }




        console.log(`Parsing "${objectKey}" and "${objectValue}"`);
        console.log(objectValue);
        console.log(typeof(objectValue) === 'boolean');
        if (typeof(objectValue) === 'boolean'){
            if (objectValue === true){
                return "oui"
            } else {
                return "non"
            }
        } else {
            return objectValue
        }
    }

    const handleEditForm = inputEvent => {
        const { name, value, files, checked } = inputEvent.target;

        setIsValidating(false)
    
        if (name === "image"){
            console.log(files[0]);
            setArticleWorkedOn(prevState => ({
              ...prevState,
              file: files[0]
            }));
        } else if(name === "published") {
            setArticleWorkedOn(prevState => ({
                ...prevState,
                published: checked
              }));

        } else {
            setArticleWorkedOn(prevState => ({
                ...prevState,
                [name]: value
              }));          
        }
      }

//----------------------------------------------------

    const apiAddArticle = async () => {
        const formData = new FormData();

        formData.append('file', articleWorkedOn.file);
        formData.append('nom', articleWorkedOn.nom);
        formData.append('price', articleWorkedOn.prixUnitaire);
        formData.append('categorie', articleWorkedOn.categorie);
        formData.append('description', articleWorkedOn.description);
        formData.append('published', articleWorkedOn.published);

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
                setArticleWorkedOn(() => ({
                    nom:"",
                    description:"",
                    prixUnitaire:0,
                    categorie:"snack",
                    file:"",
                    published: true
                  }))
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

            <div  className='ArticleCard'>
                <Form>
                    <Form.Group controlId="fileName">
                        <Form.Label className='VerticalLabel'>Photo ou image :</Form.Label> <br />
                        <Form.Control
                            className='LargeInput'
                            type="file"
                            name='image'
                            onChange={handleEditForm}
                            size="lg" 
                        />
                    </Form.Group>
                    <br />
                    
                    <div className='VerticalLabel'>Nom de l'article : </div>
                    <input
                        className='LargeInput'
                        onChange={handleEditForm}
                        value={articleWorkedOn.nom}
                        type="text"
                        name="nom"
                    />

                    <label className='FancyBr'>
                        <div className='VerticalLabel'>
                            Categorie : {" "}
                        </div>
                        <select name="categorie" className='OptionSelector' onChange={handleEditForm} value={articleWorkedOn.categorie}>
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
                        value={articleWorkedOn.prixUnitaire}
                        onChange={handleEditForm}
                        type="number"
                        name="prixUnitaire"
                    />
                    <div className='FancyBr'/>

                    <Form.Label>Description de l'article</Form.Label>
                    <br/>
                    <Form.Control
                        className='LargeInput'
                        value={articleWorkedOn.description}
                        onChange={handleEditForm}
                        as="textarea"
                        name="description"
                    />

                    <Form.Group className="mb-3" controlId="publishedCheckedid">
                        <Form.Check
                            type="checkbox"
                            name="published"
                            onChange={(e) => setArticleWorkedOn.published(e.target.checked)}
                            label="Article immédiatement disponible ?"
                            defaultChecked={true}
                        />
                    </Form.Group>
                </Form>
                
                <br className='FancyBr'/>

                {isValidating
                    ?<div className='MiniArticleCardConfirm'>
                        {Object.entries(articleWorkedOn).map(([objectKey, value]) =>
                            objectKey.startsWith("file")
                                ? ""
                                : <h3 key={objectKey}>{parseArticle(objectKey, value)}</h3>
                            )}
                        <br/>
                        <button className='ConfirmButton' onClick={apiAddArticle}>Ajouter l'article</button>
                    </div>
                    :<button onClick={prepareAddArticle} className='SubButton'>Vérifier la saisie</button>
                }                
            </div>

         {apiResponse}

        <br className='FancyBr'/>
        <button className='CancelButton' onClick={() => myAppNavigator("/manage/buvette/articles/overview")}>Liste des articles</button>
    </div>
  )
}
