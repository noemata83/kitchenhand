const UNITS = require('./unitDictionary');

class Recipe {
    constructor(name="", description="", recipeIngredient=[], recipeInstructions=[], prepTime, cookTime, totalTime) {
        this.name = name;
        this.description = description;
        this.recipeIngredient = recipeIngredient;
        this.recipeInstructions = recipeInstructions;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.totalTime = totalTime;
    }

    parseIngredients () {
        this.recipeIngredient = this.recipeIngredient.map(ingredientString => {
            var amount, unit, name;
            ({ ingredientString, amount } = this.extractAmount(ingredientString));
            ({ ingredientString, unit} = this.extractUnit(ingredientString));
            name = ingredientString.trim();        
            return {
                amount,
                unit,
                name
            }
        });
    }
    
    extractAmount (ingredientString) {
        let amount = ingredientString.match(/\d+[\/\d. ]*|\d/) || "";
        if (amount !== "") {
            amount = amount[0];
        };
        ingredientString = ingredientString.slice(amount.length);
        return {
            ingredientString,
            amount: amount.trim()
        }
    }
    
    extractUnit (ingredientString) {
        let unit = ingredientString.match(/\w*\b/)[0];
        if (UNITS.includes(unit.toLowerCase())) {
            return {
                ingredientString: ingredientString.slice(unit.length),
                unit   
            }  
        }
        return {
            ingredientString,
            unit: ''
        }
    }
}

module.exports = Recipe;