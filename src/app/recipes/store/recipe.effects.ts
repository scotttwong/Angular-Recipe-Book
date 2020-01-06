import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as RecipeActions from '../store/recipe.actions';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { switchMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects {
  private apiUrl = 'https://angular-recipebook-839b0.firebaseio.com/';

  @Effect() fetchRecipes$ = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap((action: RecipeActions.FetchRecipes) => {
      return this.http.get<Recipe[]>(this.apiUrl + 'recipes.json');
    }),
    map(recipes => {
      return recipes.map(item => {
        return {
          ...item,
          ingredients: item.ingredients || [],
          description: item.description || '',
          imagePath: item.imagePath || ''
        };
      });
    }),
    map(recipes => new RecipeActions.SetRecipes(recipes))
  );

  @Effect({ dispatch: false }) postRecipes$ = this.actions$.pipe(
    ofType(RecipeActions.POST_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipeState]) => {
      return this.http.put<{ [key: string]: string }>(this.apiUrl + 'recipes.json', recipeState.recipes);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}
