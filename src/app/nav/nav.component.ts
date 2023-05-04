import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

ModalService;
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  isAuthenticated = false;

  constructor(
    public modal: ModalService,
    public auth: AuthService,
    private router: Router
  ) {
    this.auth.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  openModal(e: Event) {
    e.preventDefault();
    this.modal.toggleModal('auth');
  }

  async logout(e: Event) {
    e.preventDefault();
    await this.auth.signOutWrapper();
    await this.router.navigateByUrl('/');
  }
}
