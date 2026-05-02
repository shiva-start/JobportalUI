import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  showPassword = signal(false);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get f() { return this.form.controls; }

  inputClass(field: string): string {
    const control = this.form.get(field);
    if (control?.invalid && control.touched) {
      return 'border-red-300 bg-red-50 focus:ring-red-500/30 text-red-900 placeholder-red-300';
    }
    if (control?.valid && control.touched) {
      return 'border-green-300 bg-green-50 focus:ring-green-500/30';
    }
    return 'border-gray-300 focus:ring-blue-500/30 focus:border-blue-500';
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const email = this.form.value.email?.trim() ?? '';
    const password = this.form.value.password ?? '';
    if (!email || !password) {
      return;
    }

    this.errorMessage.set(null);
    this.submitting.set(true);

    this.auth.login({ email, password })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (user) => {
          this.errorMessage.set(null);
          this.toastService.success(this.translate.instant('AUTH.LOGIN.WELCOME_TOAST'));
          void this.router.navigateByUrl(this.auth.getDashboardRoute(user.role));
        },
        error: (error: { message?: string }) => {
          const message = error?.message || this.translate.instant('AUTH.LOGIN.ERROR_TOAST');
          this.errorMessage.set(message);
          this.toastService.error(message);
        }
      });
  }
}
