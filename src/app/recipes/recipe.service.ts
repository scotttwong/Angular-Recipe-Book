import { OnInit, EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';

export class RecipeService {
    private recipes: Recipe[] = [];

    recipeSelected: Subject<Recipe> = new Subject();

    constructor() {
        this.recipes.push(
            new Recipe(
                'Slow-Roast Gochujang Chicken',
                'This isn’t the crisp-skinned, high-heat-roast chicken you’re probably familiar with',
                'https://i.redd.it/8gh77jbkj1n31.jpg')
        );
        this.recipes.push(
            new Recipe(
                'Tomatoes with Fresh Herb Pasta',
                'Shorter description',
                'https://assets.epicurious.com/photos/5d49f1ea888da200097dce24/6:4/w_620%2Ch_413/TomatoesHerbs_RECIPE_073119_278.jpg')
        );
    }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(id: number) {
        return this.recipes.slice()[id];
    }
}