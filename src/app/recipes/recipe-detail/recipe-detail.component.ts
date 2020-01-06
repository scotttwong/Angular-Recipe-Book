import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as RecipeActions from '../store/recipe.actions';
import * as fromApp from 'src/app/store/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  @Input() recipe: Recipe;
  recipeIndex: number;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.route.params
      .pipe(
        map((params: Params) => +params.id),
        switchMap(id => {
          this.recipeIndex = id;
          return this.store.select('recipes');
        }),
        map(recipeState => {
          return recipeState.recipes[this.recipeIndex];
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;

        if (this.recipeIndex >= 0 && this.recipe == null) {
          this.router.navigate(['/recipes']);
        }
      });
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.recipeIndex));
    this.router.navigate(['/recipes']);
  }

  onAddToShopping() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
    this.router.navigate(['/shoppinglist']);
  }

  ngOnDestroy() {
    if (this.subscription !== null || !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
