# Kitchenhand
## A simple scraper for extracting structured recipe data from the web

This is a simple utility module that attempts to retrieve and parse recipe data from websites that employ [the structured data recipe schema defined at Schema.org](http://schema.org/Recipe). The scraper can extract data both from webpages that store recipe in embedded ld+json as well as recipes that flag DOM elements with itemprops. That means that Kitchenhand should be able to handle the majority of recipes that are stored using the common schema, provided that the implementation of that schema in the markup is reasonably sane.

## Basic Usage

```
const kitchenhand = require('kitchenhand');

kitchenhand(<url>).then(recipe => {
    console.log(recipe);
});
```

Kitchenhand will return either a recipe object, or an error message if recipe data could not be retrieved from the specified URL:

```JavaScript
{ 
    message: "Could not retrieve recipe data from <url>"
}
```

## Options

The call to the `kitchenhand()` function also optionally accepts an options parameter. At present, however, only the `parseIngredients` option is handled. 

### parseIngredients

When passing the `parseIngredients` option, Kitchenhand will attempt to parse the list of ingredients into objects with three properties: `amount`, `unit`, and `name`.

```JavaScript
kitchenhand(<url>, { parseIngredients }).then(recipe => console.log(recipe));
```

If all goes well, this will result in a `recipeIngredient` array that looks like the following:

```JavaScript
Recipe {
    ...,
    recipeIngredient: [
        { amount: '1/2', unit: 'cup ', name: 'fresh parsley leaves' },
        { amount: '1/2', unit: 'cup ', name: 'fresh cilantro leaves' },
        ...
    ],
}
```

Currently, the `parseIngredients` function relies on a regexp-driven algorithm that is not exceptionally robust, especially in relation to the great variety of formats in which ingredients are listed in recipes today. Expect that your mileage may vary!
