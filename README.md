# Kitchenhand
## A simple command line recipe scraper in NodeJS

This is a simply command line utility that attempts to retrieve and parse recipe data from websites that employ [the structured data recipe schema defined at Schema.org](http://schema.org/Recipe). As of its initial commit (02-26-2018), it fares OK with recipe pages that expose their data as linked-data JSON, but considerably less well with pages that implement the structured data schema implicitly (e.g. via itemprops on HTML elements).

## Basic Usage

```
node app.js --url=[targetURL]
```
