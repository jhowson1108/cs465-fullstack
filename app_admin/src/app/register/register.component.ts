import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  public formError: string = '';

  credentials = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  public onRegisterSubmit(): void {
    this.formError = '';
    if (!this.credentials.name || !this.credentials.email ||
        !this.credentials.password || !this.credentials.confirmPassword) {
      this.formError = 'All fields are required';
    } else if (this.credentials.password !== this.credentials.confirmPassword) {
      this.formError = 'Passwords do not match';
    } else if (this.credentials.password.length < 8) {
      this.formError = 'Password must be at least 8 characters';
    } else if (!this.credentials.agree) {
      this.formError = 'You must agree to the Terms of Use and Privacy Policy';
    } else {
      this.doRegister();
    }
  }

  private doRegister(): void {
    let newUser = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    this.authenticationService.register(newUser, this.credentials.password)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err: any) => {
          this.formError = err?.error?.message || 'Registration failed';
        }
      });
  }
}
