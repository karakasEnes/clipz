import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl('', [
      Validators.required,
      Validators.min(13),
      Validators.max(120),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    ]),
    confirm_password: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(14),
      Validators.maxLength(14),
    ]),
  });

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {}

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created...';
  alertColor = 'blue';
  inSubmission = false;

  async register() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created..';
    this.alertColor = 'blue';

    const { email, password } = this.registerForm.value;

    try {
      const userCred = await this.auth.createUserWithEmailAndPassword(
        email as string,
        password as string
      );

      await this.db.collection('users').add({
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        age: this.registerForm.value.age,
        phoneNumber: this.registerForm.value.phoneNumber,
      });

      this.alertMsg = 'Account has been created successfully!';
      this.alertColor = 'green';
    } catch (e) {
      console.error(e);
      this.alertMsg = 'An error occured. Please try again!';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
  }
}

//test@gmail.com Kex2.33x
