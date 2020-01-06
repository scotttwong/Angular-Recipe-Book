import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private autoLogoutTimerID;

  constructor(private store$: Store<fromApp.AppState>) {}

  setAutoLogoutTimer(expiresInMilli: number): void {
    this.autoLogoutTimerID = setTimeout(() => {
      this.logOutUser();
    }, expiresInMilli);
  }

  logOutUser(): void {
    this.store$.dispatch(new AuthActions.Logout());
    this.clearAutoLogoutTimer();
  }

  clearAutoLogoutTimer(): void {
    if (this.autoLogoutTimerID !== null) {
      clearTimeout(this.autoLogoutTimerID);
      this.autoLogoutTimerID = null;
    }
  }
}
