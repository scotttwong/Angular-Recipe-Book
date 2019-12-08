import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (req.url.includes('firebaseio.com/recipes.json')) {
      return this.authService.currentUser.pipe(
        take(1),
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
