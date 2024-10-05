import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    console.log('Document click detected:', event);
    if (!this.elementRef.nativeElement.contains(event.target)) {
      console.log('Click outside detected');
      this.appClickOutside.emit();
    }
  }

}
