import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        let index = +params['id'];
        this.recipe = this.recipeService.getRecipe(index);
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
}
