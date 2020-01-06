import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { User } from '../user.model';
import { Action } from '@ngrx/store';
import { AuthService } from '../auth.service';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = res => {
  const user = new User(res.email, +res.expiresIn, res.idToken, res.localId, res.refreshToken);
  localStorage.setItem('authUser', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({ user, redirect: true });
};

const handleError = (res: HttpErrorResponse) => {
  let errorMessage = 'An unexpected error occured';

  if (!res.error || !res.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch (res.error.error.message) {
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'No account with email found in system';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Password does not match existing in system';
      break;
    case 'USER_DISABLED':
      errorMessage = 'User is inactive';
      break;
    case 'EMAIL_EXISTS':
      errorMessage = 'User with email already exists';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Account creation disabled';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage = 'Stop poking me';
      break;
    case 'WEAK_PASSWORD':
      errorMessage = 'Password should be at least 6 characters';
      break;
    default:
      break;
  }

  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false }) authRedirect$ = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((action: AuthActions.AuthenticateSuccess) => {
      if (action.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({ dispatch: false }) authLogOut$ = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('authUser');
      this.authService.clearAutoLogoutTimer();
      this.router.navigate(['/auth']);
    })
  );

  @Effect() authSignUp$ = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignUpStart) => {
      const formUser = {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      };

      return this.http
        .post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp', formUser, {
          params: { key: environment.firebaseApiKey }
        })
        .pipe(
          tap(res => {
            this.authService.setAutoLogoutTimer(+res.expiresIn * 1000);
          }),
          map(handleAuthentication),
          catchError(handleError)
        );
    })
  );

  @Effect() authLogin$ = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const formUser = {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      };

      return this.http
        .post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword', formUser, {
          params: { key: environment.firebaseApiKey }
        })
        .pipe(
          tap(res => {
            this.authService.setAutoLogoutTimer(+res.expiresIn * 1000);
          }),
          map(handleAuthentication),
          catchError(handleError)
        );
    })
  );

  @Effect() authAutoLogin$ = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map((authData: AuthActions.AutoLogin) => {
      const storedUser = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : null;
      if (storedUser) {
        const expiresInSecs = Math.floor((new Date(storedUser.tokenExpireDate).getTime() - new Date().getTime()) / 1000);
        const user = new User(storedUser.email, expiresInSecs, storedUser.idToken, storedUser.userId, storedUser.refreshToken);

        if (user.token) {
          this.authService.setAutoLogoutTimer(expiresInSecs * 1000);
          return new AuthActions.AuthenticateSuccess({ user, redirect: false });
          // this.setUserTimeOut(user.tokenExpireInMilli);
        }
      }

      return { type: 'DUMMY' };
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}
}
