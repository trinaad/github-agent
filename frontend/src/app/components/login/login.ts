import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  auth = inject(AuthService);
  username = signal<string>('...');

  constructor() {
    if (this.auth.isLoggedIn()) {
      this.loadUser();
    }
  }

  async loadUser() {
    const user = await this.auth.fetchUser();
    this.username.set(user.login ?? 'unknown');
  }

  onLogout() {
    this.auth.logout();
    this.username.set('...');
  }
}
