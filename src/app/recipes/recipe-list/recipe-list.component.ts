import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as fromApp from 'src/app/store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  storeSub: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.storeSub = this.store
      .select('recipes')
      .pipe(map(recipeState => recipeState.recipes))
      .subscribe(recipes => {
        this.recipes = recipes;
      });
  }

  ngOnDestroy() {
    if (this.storeSub !== null || !this.storeSub.closed) {
      this.storeSub.unsubscribe();
    }
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
