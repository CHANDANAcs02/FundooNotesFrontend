import { Component, inject } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  signupError = '';

  signupForm = this.fb.group(
    {
      firstName: [
        '',
        [
          Validators.required
        ]
      ],

      lastName: [
        '',
        [
          Validators.required
        ]
      ],

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
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]
    },
    {
      validators: this.passwordMatchValidator
    }
  );

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  signup(): void {

    console.log('Signup button clicked');

    if (this.signupForm.invalid) {

      console.log('Signup form is invalid');

      this.signupForm.markAllAsTouched();

      return;
    }

    console.log('Signup form is valid');

    this.signupError = '';

    const firstName =
      this.signupForm.value.firstName ?? '';

    const lastName =
      this.signupForm.value.lastName ?? '';

    const email =
      this.signupForm.value.email ?? '';

    const password =
      this.signupForm.value.password ?? '';

    this.authService.register({

      firstName,
      lastName,
      email,
      password,

      mobile: '0805461204'

    }).subscribe({

      next: (response) => {

        console.log(
          'Registration successful:',
          response
        );

        console.log(
          'Navigating to login...'
        );

        this.router.navigate(['/login']);

      },

      error: (error) => {

        console.error(
          'Signup failed:',
          error
        );

        this.signupError =
          error?.error?.message ||
          'Registration failed. Please try again.';

      }

    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get firstName() {
    return this.signupForm.get('firstName');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  get passwordMismatch(): boolean {

    return !!(
      this.signupForm.errors?.['passwordMismatch'] &&
      this.confirmPassword?.touched
    );

  }

}