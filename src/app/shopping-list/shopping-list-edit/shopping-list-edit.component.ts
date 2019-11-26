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

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
  @Output() ingredientDeleted: EventEmitter<void> = new EventEmitter();
  ingredientIndexSelectedSub: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  private selectedIngredientIndex: number;

  ngOnInit() { 
    this.ingredientIndexSelectedSub = this.shoppingListService.ingredientIndexSelected.subscribe((index: number) => {
      this.selectedIngredientIndex = index;
    });
  }

  addIngredient() {
    const name = this.nameInputRef.nativeElement.value;
    const amount = this.amountInputRef.nativeElement.value;
    const ingredient = new Ingredient(name, amount);

    this.shoppingListService.addIngredient(ingredient);
  }

  deleteIngredient() {
    this.shoppingListService.removeIngredient(this.selectedIngredientIndex);
  }

  clearShoppingList() {
    this.shoppingListService.clearIngredients();
    // this.ingredientsCleared.emit();
  }

  ngOnDestroy() {
    this.ingredientIndexSelectedSub.unsubscribe();
  }
}
