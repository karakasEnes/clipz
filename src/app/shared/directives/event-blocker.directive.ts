import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventBlocker]',
})
export class EventBlockerDirective {
  constructor() {}

  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  handleEvent(e: Event) {
    e.preventDefault();
  }
}
