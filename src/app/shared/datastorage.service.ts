import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class DataStorageService {
    private apiUrl = 'https://angular-recipebook-839b0.firebaseio.com/';

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService
    ) { }

    updateRecipes(): Observable<{ [key: string]: string }> {
        const recipes = this.recipeService.getRecipes();
        return this.http.put<{ [key: string]: string }>(this.apiUrl + 'recipes.json', recipes);
    }

    getRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(this.apiUrl + 'recipes.json').pipe(
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
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }
}
