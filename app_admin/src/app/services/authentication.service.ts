import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Setup our storage and service access
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  // Variable to handle Authentication Responses
  authResp: AuthResponse = new AuthResponse();

  // Get our token from our Storage provider.
  // NOTE: For this application we have decided that we will name
  // the key for our token 'travlr-token'
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');
    // Make sure we return a string even if we have no token
    if (!out) {
      return '';
    }
    return out;
  }

  // Save our token to our Storage provider.
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout of our application and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Boolean to determine if we are logged in and the token is
  // still valid. Even if we have a token we will still have to
  // reauthenticate if the token has expired
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > (Date.now() / 1000);
      } catch {
        return false; // Malformed token
      }
    } else {
      return false;
    }
  }

  // Retrieve the current user. This function should only be called
  // after the calling method has checked to make sure that the user
  // isLoggedIn.
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  // Login method that leverages the login method in tripDataService.
  // The token is saved as it passes through, and the observable is
  // returned so the caller can react to success or failure.
  public login(user: User, passwd: string): Observable<AuthResponse> {
    return this.tripDataService.login(user, passwd)
      .pipe(tap((value: AuthResponse) => this.saveToken(value.token)));
  }

  // Register method that leverages the register method in
  // tripDataService. Same pattern as login.
  public register(user: User, passwd: string): Observable<AuthResponse> {
    return this.tripDataService.register(user, passwd)
      .pipe(tap((value: AuthResponse) => this.saveToken(value.token)));
  }
}
