import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient-model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from 'src/app/store/app.reducer';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  selectedIngredientIndex: number;
  storeSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.storeSub = this.store.select('shoppingList').subscribe(stateData => {
      this.ingredients = stateData.ingredients;
      this.selectedIngredientIndex = stateData.editedIngredientIndex;
    });
  }

  ingredientSelected(index: number) {
    this.selectedIngredientIndex = index;
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
