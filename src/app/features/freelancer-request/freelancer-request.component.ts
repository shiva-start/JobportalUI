import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FreelancerRequestService } from '../../core/services/freelancer-request.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-freelancer-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  template: `
    <div [attr.dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="text-2xl font-semibold text-slate-800 rtl:text-right">{{ 'FREELANCER_REQUEST.TITLE' | translate }}</h1>
      <p class="text-slate-500 mt-2 rtl:text-right">{{ 'FREELANCER_REQUEST.SUBTITLE' | translate }}</p>

      <form (ngSubmit)="onSubmit()" [formGroup]="form" class="mt-6 space-y-4 bg-white p-6 rounded-xl border border-slate-100">
        <div>
          <label class="block text-sm font-medium text-slate-700 rtl:text-right">{{ 'FREELANCER_REQUEST.FORM.PROJECT_DESCRIPTION' | translate }}</label>
          <textarea formControlName="description" rows="4" class="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 rtl:text-right">{{ 'FREELANCER_REQUEST.FORM.REQUIRED_SKILLS' | translate }}</label>
          <input formControlName="skills" type="text" class="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 rtl:text-right">{{ 'FREELANCER_REQUEST.FORM.DURATION' | translate }}</label>
          <input formControlName="duration" type="text" [placeholder]="'FREELANCER_REQUEST.FORM.DURATION_PLACEHOLDER' | translate" class="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div class="flex items-center gap-3 rtl:flex-row-reverse">
          <button type="submit" [disabled]="form.invalid || submitting" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
            {{ 'FREELANCER_REQUEST.FORM.SUBMIT' | translate }}
          </button>
          <a routerLink="/jobs" class="text-sm text-slate-500 hover:text-slate-700">{{ 'FREELANCER_REQUEST.FORM.CANCEL' | translate }}</a>
        </div>
      </form>
    </div>
  `
})
export class FreelancerRequestComponent {
  private fb = inject(FormBuilder);
  private service = inject(FreelancerRequestService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  readonly languageService = inject(LanguageService);

  submitting = false;

  form = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(10)]],
    skills: ['', [Validators.required]],
    duration: ['']
  });

  onSubmit() {
    if (!this.auth.isAuthenticated()) {
      this.toast.error(this.translate.instant('FREELANCER_REQUEST.TOASTS.LOGIN_REQUIRED'));
      this.router.navigate(['/login']);
      return;
    }

    if (!this.auth.isEmployer()) {
      this.toast.error(this.translate.instant('FREELANCER_REQUEST.TOASTS.EMPLOYER_ONLY'));
      return;
    }

    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    // Keep fallback identity values generic so backend-bound payloads stay language-neutral.
    const payload = {
      employerId: this.auth.currentUser()?.id || 'unknown',
      employerName: this.auth.currentUser()?.company || this.auth.currentUser()?.name || this.translate.instant('FREELANCER_REQUEST.DEFAULT_EMPLOYER'),
      employerEmail: this.auth.currentUser()?.email || 'unknown',
      description: this.form.value.description,
      message: this.form.value.description,
      skills: (this.form.value.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      duration: this.form.value.duration || null
    } as any;

    setTimeout(() => {
      this.service.create(payload);
      this.submitting = false;
      this.toast.success(this.translate.instant('FREELANCER_REQUEST.TOASTS.SUBMITTED'));
      this.router.navigate(['/admin']);
    }, 600);
  }
}
