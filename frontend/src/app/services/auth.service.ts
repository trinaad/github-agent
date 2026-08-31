import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(null);

  constructor() {
    this.loadTokenFromUrl();
  }

  private loadTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      this.token.set(tokenFromUrl);
      sessionStorage.setItem('gh_token', tokenFromUrl);
      // Clean the URL so token isn't visible/bookmarked
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const stored = sessionStorage.getItem('gh_token');
      if (stored) this.token.set(stored);
    }
  }

  login() {
    window.location.href = 'http://localhost:3000/auth/github';
  }

  logout() {
    this.token.set(null);
    sessionStorage.removeItem('gh_token');
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  async fetchUser() {
    const res = await fetch('http://localhost:3000/api/user', {
      headers: { Authorization: `Bearer ${this.token()}` },
    });
    return res.json();
  }
}
