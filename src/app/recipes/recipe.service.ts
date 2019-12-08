import { OnInit, EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient-model';

export class RecipeService {
  private recipes: Recipe[] = [];

  recipesChanged: Subject<Recipe[]> = new Subject();
  recipeSelected: Subject<Recipe> = new Subject();

  constructor() {
    // this.recipes.push(
    //     new Recipe(
    //         'Slow-Roast Gochujang Chicken',
    //         'This isn’t the crisp-skinned, high-heat-roast chicken you’re probably familiar with',
    //         'https://i.redd.it/8gh77jbkj1n31.jpg',
    //         [
    //             new Ingredient('Chicken', 1),
    //             new Ingredient('Sauce', 10)
    //         ])
    // );
    // this.recipes.push(
    //     new Recipe(
    //         'Tomatoes with Fresh Herb Pasta',
    //         'Shorter description',
    //         'https://assets.epicurious.com/photos/5d49f1ea888da200097dce24/6:4/w_620%2Ch_413/TomatoesHerbs_RECIPE_073119_278.jpg',
    //         [
    //             new Ingredient('Tomatoes', 5),
    //             new Ingredient('Pasta', 8)
    //         ])
    // );
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes.slice()[id];
  }

  private notifyRecipesChanged() {
    this.recipesChanged.next(this.recipes.slice());
  }

  addRecipe(recipe: Recipe): number {
    this.recipes.push(recipe);
    this.notifyRecipesChanged();

    return this.recipes.length - 1;
  }

  updateRecipe(index: number, recipe: Recipe): number {
    this.recipes[index] = recipe;
    this.notifyRecipesChanged();

    return index;
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.notifyRecipesChanged();
  }
}
