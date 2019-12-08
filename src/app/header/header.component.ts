import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/datastorage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  // @Output() clickedPage: EventEmitter<string> = new EventEmitter();

  private userSub: Subscription;
  collapsed = true;
  authUser: User = null;

  // viewPage(pageName: string) {
  //     this.clickedPage.emit(pageName);
  // }

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser.subscribe(user => {
      this.authUser = user;
    });
  }

  onUpdateData() {
    this.dataStorageService.updateRecipes().subscribe();
  }

  onLogOut() {
    this.authService.logOutUser();
  }

  onFetchData() {
    this.dataStorageService.getRecipes().subscribe(
      res => {
        console.log('onFetchData() subscribe');
        console.log(res);
      },
      error => {
        console.log('onFetchData() error');
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
