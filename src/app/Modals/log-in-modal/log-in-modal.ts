import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { ModalService } from '../../Services/modal-service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { VerifyEmailModal } from '../verify-email-modal/verify-email-modal';

@Component({
  selector: 'app-log-in-modal',
  imports: [ReactiveFormsModule, TranslateModule, VerifyEmailModal],
  templateUrl: './log-in-modal.html',
  styleUrl: './log-in-modal.scss',
})
export class LogInModal {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly _modalService = inject(ModalService);
  private readonly _router = inject(Router);

  form: FormGroup;
  showPassword = signal(false);
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);
  savedEmail = computed(() => this._modalService.userEmail());

  constructor() {
    this.form = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get identifier() {
    return this.form.get('identifier');
  }

  get password() {
    return this.form.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    this._modalService.closeLogInModal();
  }

  submit(): void {
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService
      .logIn({
        identifier: this.identifier?.value.trim(),
        password: this.password?.value,
      })
      .subscribe({
        next: (response) => {
          this.isSubmitting.set(false);

          // წარმატებული ლოგინი
          if (response.success && response.data) {
            this.authService.setToken(response.data);
            this.authService.loadCurrentUser().subscribe(() => {
              this.close();
              this._router.navigate(['/']);
            });
            return;
          }

          // ექაუნთი არ არის ვერიფიცირებული
          if (response.message?.includes('Account is not verified.')) {
            this._modalService.setUserEmail(this.identifier?.value.trim());
            this.serverError.set(null);
            this.close();
            setTimeout(() => this._modalService.openVerifyEmailModal(), 1000);
            return;
          }

          // სხვა შეცდომა
          this.serverError.set(response.message ?? 'Invalid email/phone or password.');
        },
        error: (err) => {
          this.isSubmitting.set(false);

          const apiMessage = err?.error?.message;
          this.serverError.set(apiMessage ?? 'Something went wrong. Please try again.');
        },
      });
  }

  goToRegisterPage(event: Event): void {
    event.preventDefault();
    this._modalService.closeLogInModal();
    this._router.navigate(['/register']);
  }
}