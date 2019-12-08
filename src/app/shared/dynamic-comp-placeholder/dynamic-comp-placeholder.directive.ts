import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicCompPlaceholder]'
})
export class DynamicCompPlaceholderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}
