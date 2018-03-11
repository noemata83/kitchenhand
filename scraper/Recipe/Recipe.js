const UNITS = require('./unitDictionary');

const formUnitString = (units) => {
    return new RegExp(units.join("|"), 'gi');
}

const testUnitString = (ingredientString, unitString) => {
    return unitString.test(ingredientString.toLowerCase());
}

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
        const unitString = formUnitString(UNITS);
        this.recipeIngredient = this.recipeIngredient.map(ingredientString => {
            var amount, unit, name;
            let areThereUnits = testUnitString(ingredientString, unitString);
            if (areThereUnits) {              
                ({ ingredientString, unit} = this.extractUnit(ingredientString, unitString));
                return {
                    amount: ingredientString[0].trim(),
                    unit: unit,
                    name: ingredientString[1]
                }
            }
            ({ ingredientString, amount } = this.extractAmount(ingredientString));
            name = ingredientString.trim();        
            return {
                amount,
                name
            }
        });
        return this;
    }
    
    extractAmount (ingredientString) {
        let qtyCapture = /(((\d+\s?)|(\d+\/\d+))-((\d+\s?)?(\d+\/\d+)))|(\d+-(\*|\d+))|((\*|\d+)-\d+)|((\d+\s)?(\d+\/\d+)|\d+)/;
        let amount = ingredientString.match(qtyCapture) || "";
        if (amount !== "") {
            amount = amount[0];
        };
        ingredientString = ingredientString.slice(amount.length);
        return {
            ingredientString,
            amount: amount
        }
    }
    
    extractUnit (ingredientString, unitString) {
        const unit = ingredientString.match(unitString)[0];
        ingredientString = ingredientString.split(unit);
        return {
            ingredientString,
            unit   
        }  
    }
}



module.exports = Recipe;