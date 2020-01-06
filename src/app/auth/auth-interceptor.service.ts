import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import { take, exhaustMap, map } from 'rxjs/operators';
import * as fromApp from 'src/app/store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.includes('firebaseio.com/recipes.json')) {
      return this.store.select('auth').pipe(
        take(1),
        map(authState => {
          return authState.user;
        }),
        exhaustMap(user => {
          if (!user) {
            return next.handle(req);
          }

          const newReq = req.clone({
            params: new HttpParams().append('auth', user.token)
          });
          return next.handle(newReq);
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
