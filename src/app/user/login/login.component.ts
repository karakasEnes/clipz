import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = {
    email: 'test@gmail.com',
    password: 'Kex2.33x',
  };

  alertMsg = '';
  showAlert = false;
  alertColor = 'blue';
  isSubmission = false;

  constructor(private auth: AuthService) {}

  async login() {
    this.isSubmission = true;
    this.alertMsg = 'Loging in ... Wait please!';
    this.alertColor = 'blue';
    this.showAlert = true;

    try {
      await this.auth.loginUser(this.credentials);
      this.alertMsg = 'Successfully logged in.';
      this.alertColor = 'green';
    } catch (e) {
      this.alertMsg = "Can't log, please try again!";
      this.alertColor = 'red';
      this.showAlert = true;
      this.isSubmission = false;
      return;
    }
  }
}
