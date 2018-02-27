const cheerio = require('cheerio');
const request = require('request');
const jsdom = require('jsdom');
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
}

request(argv.url, (error, res, html) => {
    if (!error) {
        const { document } = (new JSDOM(html)).window;

        let recipe = {
            name: "",
            description: "",
            recipeIngredient: [],
            recipeInstructions: []
        }

        const JSONdata = getJSONBlob(document);
        if (Object.keys(JSONdata).length > 0) {
            recipe.name = JSONdata.name;
            recipe.description = JSONdata.description;
            recipe.recipeIngredient = JSONdata.recipeIngredient;
            recipe.recipeInstructions = JSONdata.recipeInstructions;
        } else {
            recipe = getItemProps(document, recipe);
        }
        console.log(JSON.stringify(recipe, undefined, 2));
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