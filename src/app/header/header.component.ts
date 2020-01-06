import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as AuthActions from '../auth/store/auth.actions';
import { User } from '../auth/user.model';
import * as fromAppState from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  authUser: User = null;

  private userSub: Subscription;

  constructor(private store$: Store<fromAppState.AppState>) {}

  ngOnInit(): void {
    this.userSub = this.store$.select('auth').subscribe(stateData => {
      this.authUser = stateData.user;
    });
  }

  onUpdateData() {
    // this.dataStorageService.updateRecipes().subscribe();
    this.store$.dispatch(new RecipeActions.PostRecipes());
  }

  onLogOut() {
    this.store$.dispatch(new AuthActions.Logout());
  }

  onFetchData() {
    this.store$.dispatch(new RecipeActions.FetchRecipes());
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
