import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';

@Injectable()
export class TokenStorage {

  constructor(private router: Router) { }

  checkToken() {
    if (!this.getToken()) {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['list-event']);
    }
  }

  signOut() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }
}
