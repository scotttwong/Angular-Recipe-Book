import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(x => x.RecipesModule) },
  { path: 'shoppinglist', loadChildren: () => import('./shopping-list/shopping-list.module').then(x => x.ShoppingListModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(x => x.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
