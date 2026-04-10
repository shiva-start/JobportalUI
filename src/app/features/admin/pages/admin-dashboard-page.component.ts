import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section [attr.dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'ADMIN.DASHBOARD.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.DASHBOARD.SUBTITLE' | translate }}</p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div *ngFor="let stat of admin.stats()" class="bg-white rounded-xl shadow-sm p-4">
          <p class="text-sm text-gray-500 rtl:text-right">{{ stat.label }}</p>
          <p class="mt-2 text-3xl font-bold text-gray-900 rtl:text-right">{{ stat.value }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="mb-2 font-semibold rtl:text-right">{{ 'ADMIN.DASHBOARD.SECTIONS.PLATFORM_OVERVIEW' | translate }}</h3>
          <div *ngFor="let item of admin.analytics()" class="mb-3">
            <p class="text-sm font-medium text-gray-900 rtl:text-right">{{ item.label }}</p>
            <p class="text-lg font-bold text-gray-900 rtl:text-right">{{ item.value }}</p>
            <p class="text-xs text-gray-400 rtl:text-right">{{ item.detail }}</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="mb-2 font-semibold rtl:text-right">{{ 'ADMIN.DASHBOARD.SECTIONS.FREELANCER_MEDIATION' | translate }}</h3>
          <div *ngIf="admin.freelancerRequestsList().length; else noRequests">
            <div *ngFor="let request of admin.freelancerRequestsList().slice(0, 3)" class="mb-3 rounded-lg border border-gray-100 p-3">
              <p class="text-sm font-medium text-gray-900 rtl:text-right">{{ request.employerName || request.employerEmail }}</p>
              <p class="text-sm text-gray-500 rtl:text-right">{{ request.description }}</p>
              <p class="mt-1 text-xs text-gray-400 rtl:text-right">{{ 'ADMIN.DASHBOARD.REQUEST_STATUS' | translate }}: {{ request.status }}</p>
            </div>
          </div>
          <ng-template #noRequests><p class="text-gray-400 rtl:text-right">{{ 'COMMON.NO_DATA' | translate }}</p></ng-template>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="mb-2 font-semibold rtl:text-right">{{ 'ADMIN.DASHBOARD.SECTIONS.REPORTS' | translate }}</h3>
          <div *ngIf="admin.flaggedContent().length; else noReports">
            <div *ngFor="let report of admin.flaggedContent().slice(0, 3)" class="mb-3 rounded-lg border border-gray-100 p-3">
              <p class="text-sm font-medium text-gray-900 rtl:text-right">{{ report.subject }}</p>
              <p class="mt-1 text-xs text-gray-400">{{ report.type }} · {{ report.status }}</p>
            </div>
          </div>
          <ng-template #noReports><p class="text-gray-400 rtl:text-right">{{ 'COMMON.NO_DATA' | translate }}</p></ng-template>
        </div>
      </div>
    </section>
  `,
})
export class AdminDashboardPageComponent {
  readonly admin = inject(AdminDashboardService);
  readonly languageService = inject(LanguageService);
}
