import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient-model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  recipe: Recipe;
  recipeIndex: number;
  editMode: boolean = false;
  appForm: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.recipeIndex = +params['id'];
        this.editMode = this.recipeIndex != null && !isNaN(this.recipeIndex);
        this.recipe = this.editMode ? this.recipeService.getRecipe(this.recipeIndex) : null;

        if (this.recipeIndex >= 0 && this.recipe == null) {
          this.navigateToRecipeDetail(null);
        }
      }
    )
    this.initForm();
  }  

  initForm() {
    let recipeName = null;
    let recipeDescription = null;
    let recipeImagePath = null;
    let recipeIngredients = new FormArray([]);

    if (this.recipe) {
      recipeName = this.recipe.name;
      recipeDescription = this.recipe.description;
      recipeImagePath = this.recipe.imagePath;

      if (this.recipe.ingredients) {
        for (let ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          )
        }
      }
    }

    this.appForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'description': new FormControl(recipeDescription),
      'imagePath': new FormControl(recipeImagePath),
      'ingredients': recipeIngredients
    });
  }

  onAddIngredient() {
    (<FormArray>this.appForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      }
    ));
  }

  onRemoveIngredient(index: number) {
    (<FormArray>this.appForm.get('ingredients')).removeAt(index);
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
    return (<FormArray>this.appForm.get('ingredients')).controls;
  }

  onSubmit() {
    // console.log(this.appForm);
    // const recipe = new Recipe(
    //   this.appForm.value['name'],
    //   this.appForm.value['description'],
    //   this.appForm.value['imagePath'],
    //   this.appForm.value['ingredients']
    // );
    let id:number;
    if (this.editMode) {
      id = this.recipeService.updateRecipe(this.recipeIndex, this.appForm.value);
    } else {
      id = this.recipeService.addRecipe(this.appForm.value);
    }
    this.navigateToRecipeDetail(id);
  }

  onCancel() {
    this.navigateToRecipeDetail(null);
  }
}
