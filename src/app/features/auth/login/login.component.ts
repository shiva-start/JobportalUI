import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  showPassword = signal(false);
  submitting = signal(false);

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
    this.submitting.set(true);
    setTimeout(() => {
      const success = this.auth.login(this.form.value.email!, this.form.value.password!);
      this.submitting.set(false);
      if (success) {
        this.toastService.success('Welcome back!');
        this.router.navigate([this.auth.isEmployer() ? '/employer' : '/candidate']);
      } else {
        this.toastService.error('Invalid credentials');
      }
    }, 800);
  }

  loginAsCandidate(): void {
    this.auth.loginAsCandidate();
    this.toastService.success('Logged in as candidate!');
    this.router.navigate(['/candidate']);
  }

  loginAsEmployer(): void {
    this.auth.loginAsEmployer();
    this.toastService.success('Logged in as employer!');
    this.router.navigate(['/employer']);
  }
}
