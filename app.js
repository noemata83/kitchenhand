const cheerio = require('cheerio');
const request = require('request');
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
        const $ = cheerio.load(html);

        let recipe = {
            name: "",
            description: "",
            recipeIngredient: [],
            recipeInstructions: []
        }

        const JSONdata = getJSONBlob($);
        if (Object.keys(JSONdata).length > 0) {
            recipe.name = JSONdata.name;
            recipe.description = JSONdata.description;
            recipe.recipeIngredient = JSONdata.recipeIngredient;
            recipe.recipeInstructions = JSONdata.recipeInstructions;
        } else {
            recipe = getItemProps($, recipe);
        }
        console.log(recipe);
    }
});

const getJSONBlob = ($) => {
    let json = {};
    $('script[type="application/ld+json"]').each( (_, elem) => 
    {   let data = JSON.parse($(elem).html());
        if (data['@type'] !== 'Recipe') {
            return true;
        } else {
            json = data;
        }
    }
    );
    return json;
}

const getItemProps = ($, recipe) => {
    for (let key in recipe) {
        recipe[key] = $(`[itemprop="${key}"]`).text();
    }
    return recipe;
}