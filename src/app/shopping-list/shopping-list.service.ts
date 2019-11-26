import { Ingredient } from '../shared/ingredient-model';
import { EventEmitter } from '@angular/core';

export class ShoppingListService {
    private ingredients: Ingredient[] = [];
    ingredientIndexSelected: EventEmitter<number> = new EventEmitter();
    ingredientsChanged: EventEmitter<Ingredient[]> = new EventEmitter();

    constructor() {
        this.ingredients.push(new Ingredient('Apples', 5));
        this.ingredients.push(new Ingredient('Pineapples', 2));
        this.ingredients.push(new Ingredient('Tomatoes', 3));
    }

    getIngredients() {
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.emit(this.ingredients);
    }

    removeIngredient(index: number) {
        this.ingredients.splice(index, 1);
    }

    clearIngredients() {
        // this.ingredients = [];
        this.ingredients.length = 0;
        // this.ingredients.splice(0,this.ingredients.length);
    }
}