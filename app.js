const recipeScraper = require('./scraper/recipeScraper');

const argv = require('yargs').
    option('url', {
        alias: 'u',
        describe: 'specify target url'
    })
    .demandOption('url', 'Please specify a target url')
    .help()
    .argv;

recipeScraper.fetchRecipe(argv.url)







