import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  public formError: string = '';

  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required';
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    let newUser = {
      name: '',
      email: this.credentials.email
    } as User;

    this.authenticationService.login(newUser, this.credentials.password)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: () => {
          this.formError = 'Invalid email or password';
        }
      });
  }
}
