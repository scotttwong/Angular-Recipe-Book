import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, switchMap, tap, take } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as RecipeActions from '../store/recipe.actions';
import * as fromApp from 'src/app/store/app.reducer';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  recipe: Recipe;
  recipeIndex: number;
  editMode = false;
  appForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params: Params) => +params.id),
        switchMap(id => {
          this.recipeIndex = id;
          return this.store.select('recipes');
        }),
        map(recipeState => recipeState.recipes[this.recipeIndex])
      )
      .subscribe(recipe => {
        this.editMode = this.recipeIndex != null && !isNaN(this.recipeIndex);
        this.recipe = this.editMode ? recipe : null;

        if (this.recipeIndex >= 0 && this.recipe == null) {
          this.navigateToRecipeDetail(null);
        }
        this.initForm();
      });
  }

  initForm() {
    let recipeName = null;
    let recipeDescription = null;
    let recipeImagePath = null;
    const recipeIngredients = new FormArray([]);

    if (this.recipe) {
      recipeName = this.recipe.name;
      recipeDescription = this.recipe.description;
      recipeImagePath = this.recipe.imagePath;

      if (this.recipe.ingredients) {
        for (const ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }

    this.appForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      description: new FormControl(recipeDescription),
      imagePath: new FormControl(recipeImagePath),
      ingredients: recipeIngredients
    });
  }

  onAddIngredient() {
    (this.appForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onRemoveIngredient(index: number) {
    (this.appForm.get('ingredients') as FormArray).removeAt(index);
  }

  onClearForm() {
    this.appForm.reset();
  }

  navigateToRecipeDetail(index: number): void {
    if (this.editMode) {
      this.router.navigate(['../'], { relativeTo: this.route });
      return;
    }

    if (!this.editMode && !isNaN(index) && index != null) {
      this.router.navigate(['../', index], { relativeTo: this.route });
      return;
    }

    this.router.navigate(['/recipes']);
  }

  get ingredientCtrls() {
    return (this.appForm.get('ingredients') as FormArray).controls;
  }

  onSubmit() {
    let id: number;
    const submittedRecipe = this.appForm.value;
    if (this.editMode) {
      this.store.dispatch(new RecipeActions.UpdateRecipe({ recipe: submittedRecipe, index: this.recipeIndex }));
      id = this.recipeIndex;
    } else {
      this.store.dispatch(new RecipeActions.AddRecipe(submittedRecipe));
      this.store.select('recipes').pipe(
        take(1),
        tap(recipeState => {
          id = recipeState.recipes.length;
        })
      );
    }
    this.navigateToRecipeDetail(id);
  }

  onCancel() {
    this.navigateToRecipeDetail(null);
  }
}
