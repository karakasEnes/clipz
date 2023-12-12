import { Component } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        [this.emailTaken.validate]
      ),
      age: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(13),
        Validators.max(120),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),
      confirm_password: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14),
      ]),
    },
    [RegisterValidators.match('password', 'confirm_password')]
  );

  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created...';
  alertColor = 'blue';
  inSubmission = false;

  async register() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created..';
    this.alertColor = 'blue';

    try {
      await this.auth.createUser(this.registerForm.value as IUser);
      this.alertMsg = 'Account has been created successfully!';
      this.alertColor = 'green';
    } catch (e) {
      this.alertMsg = 'An error occured. Please try again!';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
  }
}
