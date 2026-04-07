import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-employer-company-profile',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h1 class="text-2xl font-bold text-gray-900">{{ 'EMPLOYER.COMPANY_PROFILE.TITLE' | translate }}</h1>
          <p class="mt-2 text-sm text-gray-500">{{ 'EMPLOYER.COMPANY_PROFILE.SUBTITLE' | translate }}</p>

          <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-xl bg-gray-50 p-4">
              <p class="text-xs uppercase tracking-wide text-gray-400">{{ 'EMPLOYER.COMPANY_PROFILE.COMPANY' | translate }}</p>
              <p class="mt-1 text-sm font-medium text-gray-900">{{ auth.currentUser()?.company || ('EMPLOYER.COMPANY_PROFILE.EMPTY_COMPANY' | translate) }}</p>
            </div>
            <div class="rounded-xl bg-gray-50 p-4">
              <p class="text-xs uppercase tracking-wide text-gray-400">{{ 'EMPLOYER.COMPANY_PROFILE.OWNER' | translate }}</p>
              <p class="mt-1 text-sm font-medium text-gray-900">{{ auth.currentUser()?.name || ('EMPLOYER.COMPANY_PROFILE.EMPTY_OWNER' | translate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EmployerCompanyProfileComponent {
  readonly auth = inject(AuthService);
}
