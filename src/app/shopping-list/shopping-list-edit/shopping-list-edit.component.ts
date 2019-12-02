import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  OnDestroy
} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient-model';
import { ShoppingListService } from '../shopping-list.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  private selectedIngredientIndex: number;
  private ingredientSelectedSub: Subscription;

  @ViewChild('f', {static: false}) appForm: NgForm;
  @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
  @Output() ingredientDeleted: EventEmitter<void> = new EventEmitter();

  selectedIngredient: Ingredient;
  editMode: boolean = false;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() { 
    this.ingredientSelectedSub = this.shoppingListService.ingredientSelectedSub.subscribe(
      (index: number) => {        
        this.selectedIngredientIndex = index;
        
        if (index >= 0 && index != null) {
          this.selectedIngredient = this.shoppingListService.getIngredient(index);

          this.appForm.form.setValue({
            'name': this.selectedIngredient.name,
            'amount': this.selectedIngredient.amount
          });
          this.editMode = true;
        }        
      }
    );
  }

  get addEditBtnText() {
    return this.editMode ? "Update" : "Add";
  }

  addEditIngredient() {
    const name = this.appForm.value.name;
    const amt = this.appForm.value.amount;
    const ingredient = new Ingredient(name, amt);

    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.selectedIngredientIndex, ingredient)
    } else {
      this.shoppingListService.addIngredient(ingredient);
    }
    this.editMode = false;
    this.clearIngredientFields();
  }

  /*
  addIngredient() {
    const name = this.nameInputRef.nativeElement.value;
    const amount = this.amountInputRef.nativeElement.value;
    const ingredient = new Ingredient(name, amount);

    this.shoppingListService.addIngredient(ingredient);
  }
  */

  deleteIngredient() {
    this.shoppingListService.removeIngredient(this.selectedIngredientIndex);
    this.clearIngredientFields();
    this.editMode = false;
  }

  clearIngredientFields() {
    this.appForm.form.reset();
    this.editMode = false;
    this.shoppingListService.ingredientSelectedSub.next(null);
    // this.shoppingListService.clearIngredients();
  }

  ngOnDestroy() {
    this.ingredientSelectedSub.unsubscribe();
  }
}
