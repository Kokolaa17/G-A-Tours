import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { ModalService } from '../../Services/modal-service';

@Component({
  selector: 'app-verify-email-modal',
  imports: [],
  templateUrl: './verify-email-modal.html',
  styleUrl: './verify-email-modal.scss',
})
export class VerifyEmailModal implements OnChanges, OnDestroy {
  private readonly _http = inject(AuthService);
  private readonly _modalService = inject(ModalService);

  @Input() open = false;
  @Input() email = '';
  @Input() resendCooldownSeconds = 30;

  /** Emitted when the user clicks "Resend code" */
  @Output() resend = new EventEmitter<void>();

  /** Emitted when the modal should close (backdrop click / X button) */
  @Output() closed = new EventEmitter<void>();

  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  digits: string[] = ['', '', '', '', '', ''];

  // Owned internally now — these no longer come from the parent as @Input()s,
  // since this component mutates them itself during submit().
  loading = false;
  errorMessage = '';

  secondsLeft = 0;
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      // Reset state whenever the modal is (re)opened
      this.digits = ['', '', '', '', '', ''];
      this.loading = false;
      this.errorMessage = '';
      this.startCooldown();
      queueMicrotask(() => this.focusInput(0));
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  get code(): string {
    return this.digits.join('');
  }

  get isComplete(): boolean {
    return this.digits.every((d) => d.length === 1);
  }

  onInput(event: Event, index: number): void {
    // Clear any previous error as soon as the user starts correcting the code
    if (this.errorMessage) {
      this.errorMessage = '';
    }

    const input = event.target as HTMLInputElement;
    // Keep only the last digit typed, digits only
    const value = input.value.replace(/[^0-9]/g, '').slice(-1);
    this.digits[index] = value;
    input.value = value;

    if (value && index < this.digits.length - 1) {
      this.focusInput(index + 1);
    }

    if (this.isComplete) {
      this.submit();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.digits.length - 1) {
      this.focusInput(index + 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text').replace(/[^0-9]/g, '') ?? '';
    if (!pasted) return;
    event.preventDefault();

    this.errorMessage = '';

    const chars = pasted.slice(0, this.digits.length).split('');
    chars.forEach((char, i) => (this.digits[i] = char));

    const nextIndex = Math.min(chars.length, this.digits.length - 1);
    this.focusInput(nextIndex);

    if (this.isComplete) {
      this.submit();
    }
  }

  submit(): void {
    if (!this.isComplete || this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    this._http.verifyEmail({ email: this._modalService.userEmail(), code: this.code }).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('VerifyEmail response:', response);
        if (response.message.includes('Invalid verification code.')) {
          this.errorMessage = 'Invalid or expired code. Please try again.';
        }
        else {
          setTimeout(() => {
            this._modalService.closeVerifyEmailModal();
          }, 1000);
           setTimeout(() => {
            this._modalService.openLogInModal();
          }, 1500);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err?.error?.message ??
          err?.error?.errors ??
          'Invalid or expired code. Please try again.';

        // Clear digits so the user can retype, and refocus the first box
        this.digits = ['', '', '', '', '', ''];
        queueMicrotask(() => this.focusInput(0));
      },
    });
  }

  onResend(): void {
    if (this.secondsLeft > 0) return;

    this.errorMessage = '';
    this.resend.emit();
    this.startCooldown();
  }

  onClose(): void {
    this._modalService.closeVerifyEmailModal();
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  private focusInput(index: number): void {
    const el = this.digitInputs?.get(index)?.nativeElement;
    el?.focus();
    el?.select();
  }

  private startCooldown(): void {
    this.clearTimer();
    this.secondsLeft = this.resendCooldownSeconds;
    if (this.secondsLeft <= 0) return;

    this.timer = setInterval(() => {
      this.secondsLeft -= 1;
      if (this.secondsLeft <= 0) {
        this.clearTimer();
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}