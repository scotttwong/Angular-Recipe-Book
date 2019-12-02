import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient-model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  ingredientsChangedSub: Subscription;
  ingredientSelectedSub: Subscription;
  selectedIngredientIndex: number;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsChangedSub = this.shoppingListService.ingredientsChangedSub.subscribe((updatedIngredients: Ingredient[]) => {
      this.ingredients = updatedIngredients;
    });
    this.ingredientSelectedSub = this.shoppingListService.ingredientSelectedSub.subscribe((index) => {
      this.selectedIngredientIndex = index;
    })
  }

  ingredientSelected(index: number) {
    this.selectedIngredientIndex = index;
    this.shoppingListService.ingredientSelectedSub.next(index);
  }

  // ingredientSelected(index: number) {
  //   this.shoppingListService.ingredientSelected.next(index);
  // }

  ngOnDestroy() {
    this.ingredientsChangedSub.unsubscribe();
    this.ingredientSelectedSub.unsubscribe();
  }
}
