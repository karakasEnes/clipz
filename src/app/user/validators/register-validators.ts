import { AbstractControl, ValidationErrors } from '@angular/forms';

export class RegisterValidators {
  static match(formGroup: AbstractControl): ValidationErrors | null {
    const controlPsw = formGroup.get('password');
    const controlPswConfirm = formGroup.get('confirm_password');

    if (!controlPsw || !controlPswConfirm) {
      return { controlNotFound: true };
    }

    return controlPsw.value === controlPswConfirm.value
      ? null
      : { noMatch: true };
  }
}
