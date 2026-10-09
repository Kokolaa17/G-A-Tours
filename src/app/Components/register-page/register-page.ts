import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../Services/modal-service';
import { UserRegisterInterface } from '../../Interfaces/user-register-interface';
import { ApiResponseInterface } from '../../Interfaces/api-response-interface';
import { AuthService } from '../../Services/auth-service';
import { VerifyEmailModal } from '../../Modals/verify-email-modal/verify-email-modal';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, VerifyEmailModal],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _modalService = inject(ModalService);

  isSubmitting = signal(false);
  serverErrors = signal<string[]>([]);
  showPassword = signal(false);

  strongPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value ?? '';
      if (!value) return null;
  
      const errors: ValidationErrors = {};
      if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
      if (!/[0-9]/.test(value)) errors['digit'] = true;
      if (!/[^A-Za-z0-9]/.test(value)) errors['specialChar'] = true;
  
      return Object.keys(errors).length ? errors : null;
    };
  }

  georgianPhoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = (control.value ?? '').replace(/[\s-]/g, '');
      if (!value) return null;
  
      const isValid = /^(\+?995)?5\d{8}$/.test(value);
      return isValid ? null : { georgianPhone: true };
    };
  }
 
  form: FormGroup = this._fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, this.georgianPhoneValidator()]],
    password: ['', [Validators.required, Validators.minLength(8), this.strongPasswordValidator()]]
  });
 
  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
 
  get f() {
    return this.form.controls;
  }
 
  onSubmit(): void {
    this.serverErrors.set([]);
 
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    const payload: UserRegisterInterface = {
      ...this.form.value,
      phoneNumber: (this.form.value.phoneNumber ?? '').replace(/[\s-]/g, '')
    };
 
    this.isSubmitting.set(true);
 
    this._authService.register(payload).subscribe({
      next: (response: ApiResponseInterface<string>) => {
        if(response.success) {
          this.isSubmitting.set(false);
          this._modalService.setUserEmail(payload.email);
          setTimeout(() => {
            this._modalService.closeLogInModal();
            this.form.reset();
            this._modalService.openVerifyEmailModal();
          }, 1000);
        }
        else {
          this.isSubmitting.set(false);
          this.serverErrors.set([response.errors?.toString() ?? 'We could not create your account. Please check your details and try again.']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        const body: ApiResponseInterface<string> | undefined = err.error;
        if (body?.errors?.length) {
          this.serverErrors.set(body.errors);
        } else if (body?.message) {
          this.serverErrors.set([body.message]);
        } else {
          this.serverErrors.set(['We could not create your account. Please check your details and try again.']);
        }
      }
    });
  }
  
  navigateToLogin() {
    this._modalService.openLogInModal();
  }
}
