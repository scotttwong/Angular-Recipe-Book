import { Ingredient } from '../shared/ingredient-model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  private ingredients: Ingredient[] = [];
  ingredientSelectedSub: Subject<number> = new Subject();
  ingredientsChangedSub: Subject<Ingredient[]> = new Subject();


  constructor() {
    this.ingredients.push(new Ingredient('Apples', 5));
    this.ingredients.push(new Ingredient('Pineapples', 2));
    this.ingredients.push(new Ingredient('Tomatoes', 3));
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients.slice()[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.notifyIngredientChanged();
  }

  addIngredients(ingredients: Ingredient[]) {
    for (const ingredient of ingredients) {
      const existingItem = this.ingredients.find(item => item.name === ingredient.name);

      if (existingItem) {
        existingItem.amount += ingredient.amount;
      } else {
        this.ingredients.push(ingredient);
      }
    }
    this.notifyIngredientChanged();
  }


  updateIngredient(index: number, ingredient: Ingredient) {
    this.ingredients[index] = ingredient;
    this.notifyIngredientChanged();
  }

  notifyIngredientChanged() {
    this.ingredientsChangedSub.next(this.ingredients.slice());
  }

  removeIngredient(index: number) {
    // const len = this.ingredients.length;
    // for (let i = 0; i < len; i++) {
    //     if (this.ingredients[i] === ingredient) {
    //         this.ingredients.splice(i, 1);
    //     }
    // }
    this.ingredients.splice(index, 1);
    this.notifyIngredientChanged();
  }

  clearIngredients() {
    // this.ingredients = [];
    this.ingredients.length = 0;
    // this.ingredients.splice(0,this.ingredients.length);
  }
}
