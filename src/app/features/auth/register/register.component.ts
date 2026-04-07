import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  showPass = signal(false);
  submitting = signal(false);
  selectedRole = signal<'candidate' | 'employer'>('candidate');

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    companyName: [''],
    industry: [''],
    terms: [false, Validators.requiredTrue]
  });

  get f() { return this.form.controls; }

  inputClass(field: string): string {
    const c = this.form.get(field);
    if (c?.invalid && c.touched) return 'border-red-300 bg-red-50 focus:ring-red-500/30 text-red-900';
    if (c?.valid && c.touched) return 'border-green-300 bg-green-50 focus:ring-green-500/30';
    return 'border-gray-300 focus:ring-blue-500/30 focus:border-blue-500';
  }

  passwordStrength(): number {
    const p = this.f['password'].value || '';
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }

  strengthColor(): string {
    const s = this.passwordStrength();
    if (s <= 1) return 'bg-red-500';
    if (s === 2) return 'bg-orange-500';
    if (s === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  strengthTextColor(): string {
    const s = this.passwordStrength();
    if (s <= 1) return 'text-red-500';
    if (s === 2) return 'text-orange-500';
    if (s === 3) return 'text-yellow-600';
    return 'text-green-600';
  }

  strengthLabel(): string {
    const s = this.passwordStrength();
    if (s <= 1) return this.translate.instant('AUTH.FORM.STRENGTH_WEAK');
    if (s === 2) return this.translate.instant('AUTH.FORM.STRENGTH_FAIR');
    if (s === 3) return this.translate.instant('AUTH.FORM.STRENGTH_GOOD');
    return this.translate.instant('AUTH.FORM.STRENGTH_STRONG');
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    // additional minimal validation for employer flow
    if (this.selectedRole() === 'employer') {
      const company = this.form.value.companyName || '';
      const industry = this.form.value.industry || '';
      if (!company.trim() || !industry.trim()) {
        this.form.get('companyName')?.markAsTouched();
        this.form.get('industry')?.markAsTouched();
        return;
      }
    }

    this.submitting.set(true);
    setTimeout(() => {
      const success = this.auth.register(
        this.form.value.name!,
        this.form.value.email!,
        this.selectedRole()
      );
      this.submitting.set(false);
      if (success) {
        this.toastService.success(this.translate.instant('AUTH.REGISTER.SUCCESS_TOAST'));
        this.router.navigate([this.selectedRole() === 'employer' ? '/employer' : '/candidate']);
      }
    }, 1000);
  }
}
