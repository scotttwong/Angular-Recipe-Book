import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;
  recipeIndex: number;

  constructor(
    private route: ActivatedRoute, 
    private recipeService: RecipeService, 
    private router: Router, 
    private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.recipeIndex = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.recipeIndex);

        if (this.recipeIndex >= 0 && this.recipe == null) {
          this.router.navigate(['/recipes']);
        }
      }
    )
    // this.recipe = new Recipe(
    //   this.route.snapshot.queryParams['name'],
    //   this.route.snapshot.queryParams['description'],
    //   this.route.snapshot.queryParams['imagePath']
    // );
    // this.route.queryParams.subscribe(
    //   (queryParams) => {
    //     this.recipe = new Recipe(
    //       queryParams['name'],
    //       queryParams['description'],
    //       queryParams['imagePath']
    //     );
    //   }
    // )
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });  
    // this.router.navigate(['../',this.id,'edit'], {relativeTo: this.route })
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.recipeIndex);
    this.router.navigate(['/recipes']);
  }

  onAddToShopping() {
    this.shoppingListService.addIngredients(this.recipe.ingredients);
    this.router.navigate(['/shoppinglist']);
  }
}
