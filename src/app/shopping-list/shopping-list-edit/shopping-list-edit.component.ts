import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient-model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from 'src/app/store/app.reducer';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  private selectedIngredientSub: Subscription;

  @ViewChild('f', { static: false }) appForm: NgForm;
  selectedIngredient: Ingredient;
  editMode = false;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.selectedIngredientSub = this.store.select('shoppingList').subscribe(stateData => {
      const index = stateData.editedIngredientIndex;
      if (index > -1 && index != null && !isNaN(index)) {
        this.editMode = true;

        this.selectedIngredient = stateData.editedIngredient;
        this.appForm.form.setValue({
          name: this.selectedIngredient.name,
          amount: this.selectedIngredient.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  get addEditBtnText() {
    return this.editMode ? 'Update' : 'Add';
  }

  submitIngredient() {
    const name = this.appForm.value.name;
    const amt = this.appForm.value.amount;
    const ingredient = new Ingredient(name, amt);

    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
    this.editMode = false;
    this.clearIngredientFields();
  }

  deleteIngredient() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.clearIngredientFields();
    this.editMode = false;
  }

  clearIngredientFields() {
    this.appForm.form.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  ngOnDestroy() {
    this.selectedIngredientSub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
