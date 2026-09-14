import { Component, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { ModalService } from '../../Services/modal-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-log-in-modal',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './log-in-modal.html',
  styleUrl: './log-in-modal.scss',
})
export class LogInModal {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly _modalService = inject(ModalService);
 
  form: FormGroup;
  showPassword = signal(false);
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);
 
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
 
          if (response.success && response.data) {
            this.close();
          } else {
            this.serverError.set(response.message ?? 'Invalid email/phone or password.');
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);

          const apiMessage = err?.error?.message;
          this.serverError.set(apiMessage ?? 'Something went wrong. Please try again.');
        },
      });
  }
}
