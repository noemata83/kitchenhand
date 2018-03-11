const kh = require('./index');

const argv = require('yargs')
    .option('url', {
        alias: 'u',
        describe: 'specify target url'
    })
    .demandOption('url', 'Please specify a target url')
    .option('parse', {
        alias: 'p',
        describe: 'attempt to parse ingredient strings into amount/unit/ingredient name'
    })
    .help()
    .argv;
kh(argv.url, {parseIngredients: argv.parse}).then( recipe => {
    console.log(recipe);
})







