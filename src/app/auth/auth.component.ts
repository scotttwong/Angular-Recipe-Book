import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertModalComponent } from '../shared/alert-modal/alert-modal.component';
import { DynamicCompPlaceholderDirective } from '../shared/dynamic-comp-placeholder/dynamic-comp-placeholder.directive';
import { Subscription } from 'rxjs';
import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  private alertModalCloseSub: Subscription;
  private storeSub: Subscription;

  @ViewChild(DynamicCompPlaceholderDirective, { static: false }) alertModalHost: DynamicCompPlaceholderDirective;

  error: string = null;
  isLoading = false;
  isLoginMode = true;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.error = authState.authErrorMessage;
      this.isLoading = authState.isLoading;

      if (this.error) {
        this.createErrorModalComponent(this.error);
      }
    });
  }

  onChangeLoginMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;

    const email = authForm.value.email;
    const password = authForm.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      this.store.dispatch(new AuthActions.SignUpStart({ email, password }));
    }

    authForm.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  createErrorModalComponent(errorMessage: string) {
    const alertModalCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertModalComponent);
    const hostViewContainerRef = this.alertModalHost.viewContainerRef;

    hostViewContainerRef.clear();
    const alertModalCompRef = hostViewContainerRef.createComponent(alertModalCompFactory);

    alertModalCompRef.instance.message = errorMessage;
    this.alertModalCloseSub = alertModalCompRef.instance.closeModal.subscribe(() => {
      this.alertModalCloseSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.alertModalCloseSub && !this.alertModalCloseSub.closed) {
      this.alertModalCloseSub.unsubscribe();
    }
    if (this.storeSub && !this.storeSub.closed) {
      this.storeSub.unsubscribe();
    }
  }
}
