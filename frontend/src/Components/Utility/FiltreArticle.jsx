import React, { useState } from 'react'

export default function FiltreArticle(props) {

    const [searchTool, setSearchTool] = useState();

    let isListFiltered = props.isListFiltered;
    let setIsListFiltered = props.setIsListFiltered;

    let searchWarning = props.searchWarning;
    let setSearchWarning = props.setSearchWarning;

    let apiSearchByName = props.apiSearchByName;
    let apiSearchByCategory = props.apiSearchByCategory;
    let apiGetAllArticles = props.apiGetAllArticles;

    
    //isByName = true → Recherche par nom //// isByName = false → Recherche par catégorie
    const prepareSearch = (isByName) => {
        let categoryToLookFor;
        let nameToLookFor;
        let checkUnavailableArticles;

        if(isByName){
            setSearchTool(
                <div>
                    Entrez votre recherche : 
    
                    <input
                    placeholder="nom de l'article"
                    value={nameToLookFor}
                    type="text"
                    onChange={(e) => nameToLookFor = e.target.value}
                    name="searchName"
                    />
                    <br/>
                
                    Inclure les articles non disponibles ?
                    <input type="checkbox" defaultChecked={false} value={checkUnavailableArticles} onChange={() => checkUnavailableArticles = !checkUnavailableArticles}/>
                    <br/>
                    <button onClick={() => apiSearchByName(nameToLookFor, checkUnavailableArticles)}>Lancer la recherche</button>
                </div>
            );
        }else if (!isByName){
            setSearchTool(
                <div>
                   <label>
                        Rechercher un article de quelle catégorie ? 
                        <select onChange={(e) => categoryToLookFor = e.target.value}>
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
                    <br/>
                    <button onClick={() => apiSearchByCategory(categoryToLookFor, checkUnavailableArticles)}>Filtrer les articles</button>
                </div>
            );
        }else {
            setSearchWarning("Impossible de lancer une recherche");
        }

        
    }

  return (
    <div>
        <h3>
        Filtrer les articles
        <br/>
        <button onClick={() => prepareSearch (true)}>Rechercher des article par leur nom</button>
        <button onClick={() => prepareSearch (false)}>Rechercher des article par catégorie</button>
        </h3>
        { searchTool }
        { searchWarning }
        { isListFiltered 
            ? <button onClick={apiGetAllArticles}>Annuler la recherche et afficher la liste de tout les articles</button>
            : "" }
    </div>
  )
}
