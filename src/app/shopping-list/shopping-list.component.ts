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
  selectedIngredient: number;
  ingredientsChangedSub: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsChangedSub = this.shoppingListService.ingredientsChanged.subscribe((updatedIngredients: Ingredient[]) => {
      this.ingredients = updatedIngredients;
    });
  }

  ingredientSelected(index: number) {
    this.shoppingListService.ingredientIndexSelected.next(index);
  }

  ngOnDestroy() {
    this.ingredientsChangedSub.unsubscribe();
  }
}
