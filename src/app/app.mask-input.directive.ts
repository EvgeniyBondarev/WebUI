import { Directive, ElementRef, HostListener, Input, Optional, Self } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[appMaskInput]'
})

export class AppMaskInputDirective {
  @Input() appMaskInput = '';
  @Input() ngControl!: AbstractControl;

  constructor(@Optional() @Self() private selfNgControl: NgControl, private elRef: ElementRef) { }
  @HostListener('input', ['$event']) onInput(event: InputEvent){
    const control = this.selfNgControl?.control ?? this.ngControl;    
    const input = event.target as HTMLInputElement;    
    const valueInput = input.value.replace(/\D/g, '');    
    let processedValue = '';
    let indexValue = 0;
    for (let indexMask = 0; indexMask < this.appMaskInput.length; indexMask++) {      
      if(/\d/.test(this.appMaskInput[indexMask])){
        if (valueInput[indexValue]) {
          processedValue += valueInput[indexValue++];          
        }else{
          input.value = processedValue;
          break;
        }
      }else{
        processedValue += this.appMaskInput[indexMask];
      }
    }
    control.setValue(processedValue);
    
  }
}
