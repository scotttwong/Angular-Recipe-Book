import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { DynamicCompPlaceholderDirective } from './dynamic-comp-placeholder/dynamic-comp-placeholder.directive';

@NgModule({
  declarations: [
    DropdownDirective,
    LoadingSpinnerComponent,
    AlertModalComponent,
    DynamicCompPlaceholderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    DropdownDirective,
    LoadingSpinnerComponent,
    AlertModalComponent,
    DynamicCompPlaceholderDirective
  ],
  entryComponents: [
    AlertModalComponent
  ]
})
export class SharedModule { }
