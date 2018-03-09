# Kitchenhand
## A simple scraper for extracting structured recipe data from the web

This is a simple utility module that attempts to retrieve and parse recipe data from websites that employ [the structured data recipe schema defined at Schema.org](http://schema.org/Recipe). The scraper can extract data both from webpages that store recipe in embedded ld+json as well as recipes that flag DOM elements with itemprops. That means that Kitchenhand should be able to handle the majority of recipes that are stored using the common schema, provided that the implementation of that schema in the markup is reasonably sane.

## Basic Usage

```
const kitchenhand = require('kitchenhand');

kitchenhand(<url>).then( recipe => {
    console.log(recipe);
});
```