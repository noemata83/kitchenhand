const axios = require('axios');
const jsdom = require('jsdom');
const Recipe = require('./Recipe/Recipe');
const { JSDOM } = jsdom;

const alternateNames = {
    name: ['title', 'recipe'],
    description: [],
    recipeIngredient: ['recipeIngredients', 'ingredients', 'ingredient'],
    recipeInstructions: ['recipeInstruction', 'instruction', 'preparation'],
    prepTime: [],
    cookTime: [],
    totalTime: []
}


const fetchRecipe = async (url) => {
    try {
        const response = await axios.get(url); 
        const {document} = (new JSDOM(response.data)).window;
        let recipe = new Recipe();
        const JSONdata = getJSONBlob(document);
        if (Object.keys(JSONdata).length > 0) {
            for (let key in recipe) {
                recipe[key] = JSONdata[key];
            }
        } else {
            recipe = await getItemProps(document, recipe);
        }
        recipe.parseIngredients();
        console.log(recipe);
    } catch(e) {
        console.log(e);
    }
}

const getJSONBlob = (document) => {
    let json = {};
    document.querySelectorAll('script[type="application/ld+json"]').forEach( (elem) => 
    {   let data = JSON.parse(elem.innerHTML);
        if (data['@type'] !== 'Recipe') {
            return true;
        } else {
            json = data;
        }
    }
    );
    return json;
}

const getByItemProps = (document, recipe) => {
    for (let key in recipe) {
        let rawData = document.querySelectorAll(`[itemprop="${key}"]`);
        let dataArray = [];
        rawData.forEach(elem => { dataArray.push(elem.textContent.replace(/\s{3,}/g, ' ').trim()); });
        if (dataArray.length === 0) {
            dataArray = getByAlternateNames(document, key);
        }
        recipe[key] = dataArray.filter(el => el !== '');
    }
    return recipe;
}

const getByAlternateNames = (document, key) => {
    for (let i = 0; i < alternateNames[key].length; i++) {
        let dataArray = [];
        let rawData = document.querySelectorAll(`[itemprop="${alternateNames[key][i]}"]`);
        rawData.forEach(elem => { dataArray.push((elem.textContent).replace(/\s{3,}/g, ' ').trim()); });
        if (dataArray.length > 0) {
            return dataArray;
        }
    }
    return [];
}

module.exports = { fetchRecipe };