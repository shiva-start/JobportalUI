import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { Company } from '../../core/models/company.model';
import { CompaniesService } from '../../core/services/companies.service';
import { LanguageService } from '../../core/services/language.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-employer-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  template: `
    <div [dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="min-h-screen bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'EMPLOYER.COMPANY_PROFILE.TITLE' | translate }}</h1>
          <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'EMPLOYER.COMPANY_PROFILE.SUBTITLE' | translate }}</p>

          @if (errorMessage()) {
            <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 rtl:text-right">
              {{ errorMessage() }}
            </div>
          }

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-xl bg-gray-50 p-4">
              <p class="text-xs uppercase tracking-wide text-gray-400 rtl:text-right">{{ 'EMPLOYER.COMPANY_PROFILE.COMPANY' | translate }}</p>
              <p class="mt-1 text-sm font-medium text-gray-900 rtl:text-right">{{ company()?.name || auth.currentUser()?.company || ('EMPLOYER.COMPANY_PROFILE.EMPTY_COMPANY' | translate) }}</p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4">
              <p class="text-xs uppercase tracking-wide text-gray-400 rtl:text-right">{{ 'EMPLOYER.COMPANY_PROFILE.OWNER' | translate }}</p>
              <p class="mt-1 text-sm font-medium text-gray-900 rtl:text-right">{{ auth.currentUser()?.name || ('EMPLOYER.COMPANY_PROFILE.EMPTY_OWNER' | translate) }}</p>
            </div>
          </div>

          <form class="grid grid-cols-1 gap-4 md:grid-cols-2" [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="md:col-span-2">
              <label class="mb-1 block text-sm font-medium text-gray-700 rtl:text-right">Company Name</label>
              <input formControlName="name" type="text" class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 rtl:text-right" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 rtl:text-right">Industry</label>
              <input formControlName="industry" type="text" class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 rtl:text-right" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 rtl:text-right">Location</label>
              <input formControlName="location" type="text" class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 rtl:text-right" />
            </div>
            <div class="md:col-span-2">
              <label class="mb-1 block text-sm font-medium text-gray-700 rtl:text-right">Description</label>
              <textarea formControlName="description" rows="4" class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 rtl:text-right"></textarea>
            </div>
            <div class="md:col-span-2 flex justify-end">
              <button
                type="submit"
                [disabled]="submitting()"
                class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ company() ? 'Update company profile' : 'Create company profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class EmployerCompanyProfileComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly languageService = inject(LanguageService);
  private readonly companiesService = inject(CompaniesService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly company = signal<Company | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    industry: [''],
    location: [''],
    description: [''],
  });

  ngOnInit(): void {
    this.loadMyCompany();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.form.value.name?.trim() || '',
      industry: this.form.value.industry?.trim() || null,
      location: this.form.value.location?.trim() || null,
      description: this.form.value.description?.trim() || null,
    };

    this.submitting.set(true);
    this.errorMessage.set(null);

    const request$ = this.company()
      ? this.companiesService.updateCompany(this.company()!.id, payload)
      : this.companiesService.createCompany(payload);

    request$
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (company) => {
          this.company.set(company);
          this.form.patchValue({
            name: company.name,
            industry: company.industry ?? '',
            location: company.location ?? '',
            description: company.description ?? '',
          });
          this.toast.success('Company profile saved successfully.');
          void this.auth.getCurrentUser().subscribe();
        },
        error: (error) => this.handleError(error),
      });
  }

  private loadMyCompany(): void {
    this.errorMessage.set(null);
    this.companiesService.getMyCompany().subscribe({
      next: (company) => {
        this.company.set(company);
        this.form.patchValue({
          name: company.name,
          industry: company.industry ?? '',
          location: company.location ?? '',
          description: company.description ?? '',
        });
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return;
        }

        this.handleError(error);
      },
    });
  }

  private handleError(error: unknown): void {
    const fallback = this.translate.instant('AUTH.LOGIN.ERROR_TOAST');
    const message = error instanceof HttpErrorResponse
      ? (error.error?.message || error.error?.error || error.message || fallback)
      : fallback;

    this.errorMessage.set(message);
    this.toast.error(message);
  }
}
