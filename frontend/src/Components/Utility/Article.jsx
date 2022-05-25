import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Container, Form, Button } from 'react-bootstrap'

export default function Article(props) {

    let emptyArticle = {
        nom:"",
        description:"",
        prixUnitaire:"",
        categorie:"",
        file:"",
      };

    let article = props.article;
    let newArticle = props.newArticle || emptyArticle;
    let isEditingArticle = props.isEditingArticle;

    let displayToggleArticleButton = props.displayToggleArticleButton;
    let dispplayEditArticleButton = props.dispplayEditArticleButton;

    let displayGoBackButton = props.displayGoBackButton;

    let disableConfirmButton = props.disableConfirmButton;

    let handleEditForm = props.handleEditForm || null;
    let apiEditArticle = props.backEndAPIRequest;
    let apiToggleArticle = props.backEndAPIRequest; // TEMPORAIRE

    const myAppNavigator = useNavigate();

    return (
        <div className={article.isDisponible ? 'ArticleCard' : 'ArticleCardUnavailable'}>
            
            <div className='ArticleName'>{article.nom}
                {(isEditingArticle && (newArticle.nom !== article.nom)) 
                    ? <><br /> ↓ <b><br />{newArticle.nom}</b> </>
                    : ""}
            </div>
                <img className='CardPhoto' src={article.photo}/>
                <div >
                    <div className='ArticlePrix'>{article.isDisponible ? ` ${article.prixUnitaire}€ ` : "Non disponible"}
                        {(isEditingArticle && (newArticle.prixUnitaire != article.prixUnitaire)) 
                            ? <> → <b>{newArticle.prixUnitaire}€</b> </>
                            : ""}
                    </div>

                    <div><u>Categorie :</u> {article.categorie}
                        {(isEditingArticle && (newArticle.categorie !== article.categorie)) 
                            ? <> → <b>{newArticle.categorie}</b> </>
                            : ""}
                    </div>

                    <div className='ArticleDescription'><i>{article.description ? `"${article.description}"` : ""}</i>
                    <br/>
                        {(isEditingArticle && (newArticle.description !== article.description)) 
                            ? <> ↓ <br /><b>{newArticle.description}</b> </>
                            : ""}
                    </div>
                    
                    {/* <div>Disponible : {article.isDisponible ? "oui" : "non" }
                        {(isEditingArticle && (newArticle.isDisponible !== article.isDisponible)) 
                            ? <> → <b>{newArticle.isDisponible}</b> </>
                            : ""}
                    </div> */}
                </div>
           

            <div className='ButtonContainer' style={{width: "100%"}}>
                <button className='ConfirmButton' hidden={!dispplayEditArticleButton} onClick={apiEditArticle}>Valider les modifications</button>
                <button className='SubButton' hidden={!displayGoBackButton} onClick={() => {myAppNavigator("/manage/buvette/articles/overview")}}>Liste des articles</button>

                <button className={article.isDisponible ? "RedButton" : "ConfirmButton"} hidden={!displayToggleArticleButton} disabled={disableConfirmButton}  onClick={() => apiToggleArticle(article)}>Rendre {article.isDisponible ? "non disponible" : "disponible"}</button>

                 {/*<button className={article.isDisponible ? "CancelButton" : "ConfirmButton"} hidden={!displayToggleArticleButton} onClick={() => console.log("Bouton activation/désactivation !")}>Rendre cet article {article.isDisponible ? "non disponible" : "disponible"}</button>*/}
            </div>


            <div hidden={!isEditingArticle} className='FancyBr'>
                <hr />
                <h4>Entrez les modifications désirées</h4>
                <div >
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
                            value={newArticle.nom}
                            type="text"
                            name="nom"
                        />

                        <label className='FancyBr'>
                            <div className='VerticalLabel'>
                                Categorie : {" "}
                            </div>
                            <select name="categorie" 
                            className='OptionSelector' onChange={handleEditForm} value={newArticle.categorie}>
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
                            onChange={handleEditForm}
                            value={newArticle.prixUnitaire}
                            type="number"
                            name="prixUnitaire"
                        />
                        <div className='FancyBr'/>

                            <Form.Label>Description de l'article</Form.Label>
                            <br/>
                            <Form.Control
                                className='LargeInput'
                                onChange={handleEditForm}
                                value={newArticle.description}
                                as="textarea"
                                name="description"
                            />
                    </Form>
                </div>
                <div className='FancyBr'/>
            </div>
        </div>
    )
}
