import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
  static match(controlNameOne: string, controlNameTwo: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const controlOne = formGroup.get(controlNameOne);
      const controlTwo = formGroup.get(controlNameTwo);

      if (!controlOne || !controlTwo) {
        // this error is for the devs.
        return { controlNotFound: true };
      }

      const err =
        controlOne.value === controlTwo.value ? null : { noMatch: true };
      controlTwo.setErrors(err);
      return err;
    };
  }
}
