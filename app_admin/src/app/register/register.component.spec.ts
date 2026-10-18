import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthenticationService } from '../services/authentication.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerCalls = 0;
  let failRegister = false;

  const mockAuthService = {
    register: () => {
      registerCalls++;
      return failRegister
        ? throwError(() => ({ error: { message: 'Email address already registered' } }))
        : of({ token: 'abc' });
    }
  };

  const fill = (overrides: object = {}) => {
    component.credentials = {
      name: 'Test Admin',
      email: 'test@travlr.test',
      password: 'password123',
      confirmPassword: 'password123',
      agree: true,
      ...overrides
    };
  };

  beforeEach(async () => {
    registerCalls = 0;
    failRegister = false;
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthenticationService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should require all fields', () => {
    fill({ name: '' });
    component.onRegisterSubmit();
    expect(component.formError).toEqual('All fields are required');
    expect(registerCalls).toEqual(0);
  });

  it('should reject mismatched passwords', () => {
    fill({ confirmPassword: 'different123' });
    component.onRegisterSubmit();
    expect(component.formError).toEqual('Passwords do not match');
    expect(registerCalls).toEqual(0);
  });

  it('should reject short passwords', () => {
    fill({ password: 'short', confirmPassword: 'short' });
    component.onRegisterSubmit();
    expect(component.formError).toEqual('Password must be at least 8 characters');
  });

  it('should require agreeing to the terms', () => {
    fill({ agree: false });
    component.onRegisterSubmit();
    expect(component.formError).toContain('Terms of Use');
    expect(registerCalls).toEqual(0);
  });

  it('should register when the form is valid', () => {
    fill();
    component.onRegisterSubmit();
    expect(registerCalls).toEqual(1);
    expect(component.formError).toEqual('');
  });

  it('should show the server message when registration fails', () => {
    failRegister = true;
    fill();
    component.onRegisterSubmit();
    expect(component.formError).toEqual('Email address already registered');
  });
});
