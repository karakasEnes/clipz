import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
  static match(controlNameOne: string, controlNameTwo: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const controlOne = formGroup.get(controlNameOne);
      const controlTwo = formGroup.get(controlNameTwo);

      if (!controlOne || !controlTwo) {
        return { controlNotFound: true };
      }

      return controlOne.value === controlTwo.value ? null : { noMatch: true };
    };
  }
}
