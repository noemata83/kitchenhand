const axios = require('axios');
const jsdom = require('jsdom');
const Recipe = require('./Recipe/Recipe');
const { JSDOM } = jsdom;

const alternateKeys = require('./alternateKeys');


const fetchRecipe = async (url, options) => {
    /* options
        parseIngredients: boolean; if true attempts to parse ingredients into structured data
    */
    try {
        const response = await axios.get(url); 
        const {document} = (new JSDOM(response.data)).window;
        let recipe = new Recipe();
        const JSONdata = getJSONBlob(document);
        if (Object.keys(JSONdata).length > 0) {
            for (let key in recipe) {
                if (JSONdata[key]) {
                    recipe[key] = JSONdata[key];
                }
            }
        } else {
            recipe = getByItemProps(document, recipe);
        }
        if (options && options.parseIngredients) {
            recipe = recipe.parseIngredients();
        }
        recipe = checkIfEmpty(recipe);
        return recipe || { message: `Could not retrieve recipe data from ${url}`};
    } catch(e) {
        return e;
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
            dataArray = getByAlternateKeys(document, key);
        }
        recipe[key] = dataArray.filter(el => el !== '');
    }
    return recipe;
}

const getByAlternateKeys = (document, key) => {
    for (let i = 0; i < alternateKeys[key].length; i++) {
        let dataArray = [];
        let rawData = document.querySelectorAll(`[itemprop="${alternateKeys[key][i]}"]`);
        rawData.forEach(elem => { dataArray.push((elem.textContent).replace(/\s{3,}/g, ' ').trim()); });
        if (dataArray.length > 0) {
            return dataArray;
        }
    }
    return [];
}

const checkIfEmpty = (recipe) => {
    const emptyRecipe = Object.keys(recipe).every(key => recipe[key].length === 0);
    recipe = emptyRecipe ? null: recipe;
    return recipe;
}

module.exports = fetchRecipe;