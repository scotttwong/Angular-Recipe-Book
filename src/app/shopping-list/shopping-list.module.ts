import { NgModule } from '@angular/core';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent
  ],
  imports: [
    ShoppingListRoutingModule,
    FormsModule,
    SharedModule
  ],
  exports: []
})

export class ShoppingListModule { }
