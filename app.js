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
        const dataArray = [];
        rawData.forEach(elem => { dataArray.push(elem.textContent.replace(/\s{3,}/g, '')); });
        recipe[key] = dataArray;
    }
    return recipe;
}