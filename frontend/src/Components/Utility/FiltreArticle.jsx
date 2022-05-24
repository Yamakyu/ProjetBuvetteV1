import React, { useState } from 'react'

export default function FiltreArticle(props) {

    const [searchTool, setSearchTool] = useState();

    let setIsListFiltered = props.setIsListFiltered;

    let fullArticlesList = props.fullArticlesList;
    let setArticleListResult = props.setArticleListResult

    let searchWarning = props.searchWarning;
    let setSearchWarning = props.setSearchWarning;

    let apiSearchByName = props.apiSearchByName;
    let apiSearchByCategory = props.apiSearchByCategory;


    const handleInputSelect = (inputEvent) => {
        switch (inputEvent.target.value) {
            case "name":
                prepareSearchArticleByName();    
                break;
            case "category":
                prepareSearchArticleByCategory();
                break;
            case "all":
            default:
                setArticleListResult(fullArticlesList);
                setSearchTool("");
                setIsListFiltered(false);
                break
            }
    }

    const prepareSearchArticleByCategory = () => {
        let categoryToLookFor = "snack";
        let checkUnavailableArticles = false;
        
        setSearchTool(
            <div>
               <label>
                    Choisissez la catégorie : {" "}
                    <select defaultValue={"snack"} onChange={(e) => categoryToLookFor = e.target.value}>
                        <option value="snack">Snack</option>
                        <option value="friandise">friandise</option>
                        <option value="boisson chaude">Boisson chaude</option>
                        <option value="boisson fraiche">Boisson fraîche</option>
                        <option value="plat chaud">Plat chaud</option>
                        <option value="plat froid">Plat froid</option>
                    </select>
                </label>
                <br/>
            
                Inclure les articles non disponibles ? 
                <input type="checkbox" defaultChecked={false} value={checkUnavailableArticles} onChange={() => checkUnavailableArticles = !checkUnavailableArticles}/>
                <button className='MiniCardSubButton' onClick={() => apiSearchByCategory(categoryToLookFor, checkUnavailableArticles)}>Filtrer les articles</button>
            </div>
        );
    }

    const prepareSearchArticleByName = () => {
        let nameToLookFor;
        let checkUnavailableArticles = false;
        
        setSearchTool(
            <div>
                Entrez votre recherche : {" "}

                <input
                placeholder="Nom de l'article"
                value={nameToLookFor}
                type="text"
                onChange={(e) => nameToLookFor = e.target.value}
                name="searchName"
                />
                <br/>
               
                Inclure les articles non disponibles ?
                <input type="checkbox" defaultChecked={false} value={checkUnavailableArticles} onChange={() => checkUnavailableArticles = !checkUnavailableArticles}/>

                <button className='MiniCardSubButton' onClick={() => apiSearchByName(nameToLookFor, checkUnavailableArticles)}>Filtrer les articles</button>
            </div>
        );
    }
    
  return (
    <div>
        <h3>
            
            <label>
                Rechercher des articles... ? {" "}
                <select onChange={handleInputSelect}>
                    <option value="all"> Afficher tout les articles </option>
                    <option value="name"> Rechercher par nom </option>
                    <option value="category"> Rechercher par catégorie </option>
                </select>
            </label>
        </h3>
        { searchTool }
        <div className='BoxSimple'>
            <div className='APIResponse'>{searchWarning}</div>
        </div>
        
    </div>
  )
}
