const request = require('request');
const jsdom = require('jsdom');
const units = require('./unitDictionary');

const { JSDOM } = jsdom;
const argv = require('yargs').
    option('url', {
        alias: 'u',
        describe: 'specify target url'
    })
    .demandOption('url', 'Please specify a target url')
    .help()
    .argv;

const alternateNames = {
    name: ['title', 'recipe'],
    description: [],
    recipeIngredient: ['recipeIngredients', 'ingredients', 'ingredient'],
    recipeInstructions: ['recipeInstruction', 'instruction', 'preparation'],
    prepTime: [],
    cookTime: [],
    totalTime: []
}

request(argv.url, (error, res, html) => {
    if (!error) {
        const { document } = (new JSDOM(html)).window;

        let recipe = {
            name: "",
            description: "",
            recipeIngredient: [],
            recipeInstructions: [],
            prepTime: null,
            cookTime: null,
            totalTime: null,
        }

        const JSONdata = getJSONBlob(document);
        if (Object.keys(JSONdata).length > 0) {
            for (let key in recipe) {
                recipe[key] = JSONdata[key];
            }
        } else {
            recipe = getItemProps(document, recipe);
        }
        recipe.recipeIngredient = recipe.recipeIngredient.map(ingredient => parseIngredientString(ingredient));
        console.log(recipe);
    }
});

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

const getItemProps = (document, recipe) => {
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

const parseIngredientString = (ingredientString) => {
    const ingredient = {};
    let amount = ingredientString.match(/\d+[\/\d. ]*|\d/) || "";
    if (amount !== "") {
        amount = amount[0];
    }
    ingredientString = ingredientString.slice(amount.length);
    ingredient.amount = amount.trim();
    unitString = ingredientString.match(/\w*\b/)[0];
    if (units.includes(unitString)) {
        ingredient.unit = unitString;
        ingredientString = ingredientString.slice(unitString.length);
    }
    ingredient.name = ingredientString.trim();
    return ingredient;
}