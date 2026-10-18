import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { TripDataService } from './trip-data.service';
import { BROWSER_STORAGE } from '../storage';

// Build an unsigned token with the given payload; the client only reads the payload
function makeToken(payload: object): string {
  return 'header.' + btoa(JSON.stringify(payload)) + '.signature';
}

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let store: { [key: string]: string };

  const mockStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; }
  };

  const mockTripDataService = {
    login: () => of({ token: makeToken({ email: 'a@b.test', name: 'A', exp: 9999999999 }) }),
    register: () => of({ token: makeToken({ email: 'a@b.test', name: 'A', exp: 9999999999 }) })
  };

  beforeEach(() => {
    store = {};
    TestBed.configureTestingModule({
      providers: [
        { provide: BROWSER_STORAGE, useValue: mockStorage },
        { provide: TripDataService, useValue: mockTripDataService }
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should not be logged in without a token', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should be logged in with an unexpired token', () => {
    store['travlr-token'] = makeToken({ exp: Date.now() / 1000 + 3600 });
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should not be logged in with an expired token', () => {
    store['travlr-token'] = makeToken({ exp: Date.now() / 1000 - 60 });
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should not be logged in with a malformed token', () => {
    store['travlr-token'] = 'not-a-jwt';
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should save the token on login and remove it on logout', () => {
    service.login({ email: 'a@b.test', name: '' }, 'password1').subscribe();
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getCurrentUser().email).toEqual('a@b.test');
    service.logout();
    expect(store['travlr-token']).toBeUndefined();
    expect(service.isLoggedIn()).toBe(false);
  });
});
