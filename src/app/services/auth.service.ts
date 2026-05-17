import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  username = '';

  login(username: string) {
    this.username = username?.trim() || 'User';
  }

  logout() {
    this.username = '';
  }

  get displayName(): string {
    return this.username || 'Guest';
  }

  get isLoggedIn(): boolean {
    return !!this.username;
  }
}
