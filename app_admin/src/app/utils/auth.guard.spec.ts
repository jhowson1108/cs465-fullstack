import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('authGuard', () => {
  let loggedIn = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthenticationService, useValue: { isLoggedIn: () => loggedIn } }
      ]
    });
  });

  const runGuard = () => TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

  it('should allow access when logged in', () => {
    loggedIn = true;
    expect(runGuard()).toBe(true);
  });

  it('should redirect to /login when logged out', () => {
    loggedIn = false;
    const result = runGuard() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toEqual('/login');
  });
});
