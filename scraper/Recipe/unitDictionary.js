/*  To get started, we are just going to create an array of common unit words, which we'll try to
    match against the first non-numeric substring in an ingredient item. This is an extremely
    crude way to go: it will fail even to capture a common unit like 'fluid ounces'/'fl. oz.'!
    Eventually, we would like to parse the ingredient string more systematically,
    perhaps using a learning algorithm of some sorts to attempt to tag unit-words and abbreviations
    automatically. This is a very temporary fix!    
*/

module.exports = [
    '\\bt\\s',
    'tsp(\\.)?(s)?',
    'teaspoon(s)?',
    'tbsp((\\.)?(s)?)?',
    'tablespoon(s)?',
    '(fluid )?ounce(s)?',
    '\\b(fl(\\.)? )?oz(\\.)?',
    '\\bc(up)?(s)?\\s',
    '\\bp(int||t(\\.)?)?(s)?\\s',
    'q(uart||t(\\.)?)?(\\.)?(s)?\\s',
    '/g(al(\\.)?||allon)?\\s',
    'ml(\\.)?(s)?\\s',
    'millilit(er|re)(s)?',
    'cc(\\.)?(s)?\\s',
    '\\bl(\\.)?(s)?\\s',
    'lit(er|re)(s)?',
    'dl(\\.)?(s)?\\s',
    'decilit(er|re)(s)?',
    'pound(s)?',
    'lb(\\.)?(s)?(\\.)?(s)?\\s',
    'mg(\\.)?(s)?',
    'milligram(me)?(s)?',
    '\\bg(ram(s)?)?\\s',
    'gram(s)?',
    'kg\\s/',
    'kilogram(me)?(s)?',
    '\\bmm\\s',
    'millimet(er|re)(s)?',
    'cm\\s',
    'centimet(er|re)(s)?',
    '\"\"(s)?',
    '\\b(p)?in(ch(es)?)?(\\.)?',
    '\\bds\\s',
    'dash(es)?'
]