import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponse } from './auth.service';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AlertModalComponent } from '../shared/alert-modal/alert-modal.component';
import { DynamicCompPlaceholderDirective } from '../shared/dynamic-comp-placeholder/dynamic-comp-placeholder.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  private alertModalCloseSub: Subscription;

  @ViewChild(DynamicCompPlaceholderDirective, { static: false }) alertModalHost: DynamicCompPlaceholderDirective;

  error: string = null;
  isLoading = false;
  isLoginMode = true;


  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
  }

  onChangeLoginMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) { return; }

    this.isLoading = true;

    const email = authForm.value.email;
    const password = authForm.value.password;

    let authObsv = null;

    if (this.isLoginMode) {
      authObsv = this.authService.loginUser(email, password);
    } else {
      authObsv = this.authService.createUser(email, password);
    }

    authObsv.subscribe(
      res => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error => {
        this.isLoading = false;
        // this.error = error;
        this.createErrorModalComponent(error);
      }
    );

    authForm.reset();
  }

  onHandleError() {
    this.error = null;
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
  }
}
