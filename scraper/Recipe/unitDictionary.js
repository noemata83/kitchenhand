/*  To get started, we are just going to create an array of common unit words, which we'll try to
    match against the first non-numeric substring in an ingredient item. This is an extremely
    crude way to go: it will fail even to capture a common unit like 'fluid ounces'/'fl. oz.'!
    Eventually, we would like to parse the ingredient string more systematically,
    perhaps using a learning algorithm of some sorts to attempt to tag unit-words and abbreviations
    automatically. This is a very temporary fix!    

*/

module.exports = [
    't\\s',
    'tsp(\\.)?(s)?',
    'teaspoon(s)?',
    'tbsp((\\.)?(s)?)?',
    'tablespoon(s)?',
    'ounce(s)?',
    'oz(\.)?\\s',
    'c(up)?(s)?\\s',
    'p(int||t(\\.)?)?(s)?\\s',
    'q(uart||t(\\.)?)?(\\.)?(s)?\\s',
    '/g(al(\\.)?||allon)?\\s',
    'ml(\\.)?(s)?\\s',
    'millilit(er|re)(s)?',
    'cc(\\.)?(s)?\\s',
    'l(\\.)?(s)?\\s',
    'lit(er|re)(s)?',
    'dl(\\.)?(s)?\\s',
    'decilit(er|re)(s)?',
    'pound(s)?',
    'lb(\\.)?(s)?(\\.)?(s)?\\s',
    'mg(\\.)?(s)?',
    'milligram(me)?(s)?',
    'g(ram(s)?)?\\s',
    'gram(s)?',
    'kg\\s/',
    'kilogram(me)?(s)?',
    'mm\\s',
    'millimet(er|re)(s)?',
    'cm\\s',
    'centimet(er|re)(s)?',
    '\"\"(s)?',
    '(p)?in(ch(es)?)?(\\.)?',
    'ds\\s',
    'dash(es)?'
]