import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })

export class AuthService {

  private userTimeoutID: any;

  currentUser: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  loginUser(email: string, password: string) {
    const formUser = { email, password, returnSecureToken: true };
    return this.http.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
      formUser,
      {
        params: { key: environment.firebaseApiKey }
      }
    ).pipe(
      catchError(res => this.handleErrorMessage(res)),
      tap(res => { this.handleUserLogin(res.email, +res.expiresIn, res.idToken, res.localId, res.refreshToken); })
    );
  }

  createUser(email: string, password: string) {
    const formUser = { email, password, returnSecureToken: true };
    return this.http.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp',
      formUser,
      {
        params: { key: environment.firebaseApiKey }
      }
    ).pipe(
      catchError(res => this.handleErrorMessage(res)),
      tap(res => { this.handleUserLogin(res.email, +res.expiresIn, res.idToken, res.localId, res.refreshToken); })
    );
  }

  logOutUser() {
    this.currentUser.next(null);
    clearTimeout(this.userTimeoutID);
    localStorage.removeItem('user');
    this.router.navigate(['/auth']);
  }

  setUserFromStorage() {
    const storageUser: {
      email: string,
      expiresIn: number,
      id: string,
      idToken: string,
      refreshToken: string,
      tokenExpireDate: string
    } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    if (storageUser) {
      const expireInSecs = Math.floor((new Date(storageUser.tokenExpireDate).getTime() - new Date().getTime()) / 1000);
      const loadedUser = new User(
        storageUser.email,
        expireInSecs,
        storageUser.idToken,
        storageUser.id,
        storageUser.refreshToken
      );

      if (loadedUser.token) {
        this.currentUser.next(loadedUser);
        this.setUserTimeOut(loadedUser.tokenExpireInMilli);
      }
    }
  }

  handleUserLogin(email: string, expiresIn: number, idToken: string, id: string, refreshToken: string) {
    const user = new User(email, expiresIn, idToken, id, refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.setUserTimeOut(user.tokenExpireInMilli);
    this.currentUser.next(user);
  }

  setUserTimeOut(expiresInMilli: number) {
    this.userTimeoutID = setTimeout(() => {
      this.logOutUser();
    }, expiresInMilli);
  }

  handleErrorMessage(res: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occured';
    if (!res.error || !res.error.error) {
      return throwError(errorMessage);
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
      // default:
      //     errorMessage = res.error.error.message;
    }
    return throwError(errorMessage);
  }
}
