import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  loginError = '';

  loginForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]

  });

  login(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.loginError = '';

    const email =
      this.loginForm.value.email ?? '';

    const password =
      this.loginForm.value.password ?? '';

    this.authService.login({
      email,
      password
    }).subscribe({

      next: (response) => {

        console.log('Login successful');

        this.authService.saveToken(response);

        this.router.navigate(['/notes']);

      },

      error: (error) => {

        console.error(
          'Login failed:',
          error
        );

        this.loginError =
          error?.error?.message ||
          'Invalid email or password. Please try again.';

      }

    });
  }

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}