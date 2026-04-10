import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section [attr.dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 rtl:text-right">{{ 'ADMIN.USERS.CANDIDATES' | translate }}</h2>
          <div *ngIf="admin.candidates().length; else noCandidates" class="space-y-3">
            <div *ngFor="let user of admin.candidates()" class="rounded-xl border border-gray-100 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-gray-900 rtl:text-right">{{ nameKey(user?.name) ? (nameKey(user?.name)! | translate) : user?.name }}</p>
                  <p class="text-sm text-gray-500 rtl:text-right">{{ user?.email }}</p>
                  <p class="text-xs text-gray-400 rtl:text-right">{{ locationKey(user?.location) ? (locationKey(user?.location)! | translate) : (user?.location || ('COMMON.NO_DATA' | translate)) }}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{{ statusKey(user?.accountStatus) | translate }}</span>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <button type="button" (click)="admin.setUserStatus(user.id, 'inactive')" class="px-3 py-1 rounded-lg text-sm font-medium bg-amber-100 text-amber-700">{{ 'ADMIN.USERS.DEACTIVATE' | translate }}</button>
                <button type="button" (click)="admin.setUserStatus(user.id, 'blocked')" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">{{ 'ADMIN.USERS.BLOCK' | translate }}</button>
              </div>
            </div>
          </div>
          <ng-template #noCandidates><p class="text-gray-400 rtl:text-right">{{ 'COMMON.NO_DATA' | translate }}</p></ng-template>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 rtl:text-right">{{ 'ADMIN.USERS.EMPLOYERS' | translate }}</h2>
          <div *ngIf="admin.employers().length; else noEmployers" class="space-y-3">
            <div *ngFor="let user of admin.employers()" class="rounded-xl border border-gray-100 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-gray-900 rtl:text-right">{{ companyKey(user?.company || user?.name) ? (companyKey(user?.company || user?.name)! | translate) : (user?.company || user?.name) }}</p>
                  <p class="text-sm text-gray-500 rtl:text-right">{{ user?.email }}</p>
                  <p class="text-xs text-gray-400 rtl:text-right">{{ titleKey(user?.title) ? (titleKey(user?.title)! | translate) : (user?.title || ('COMMON.NO_DATA' | translate)) }}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{{ statusKey(user?.accountStatus) | translate }}</span>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <button type="button" (click)="admin.setUserStatus(user.id, 'inactive')" class="px-3 py-1 rounded-lg text-sm font-medium bg-amber-100 text-amber-700">{{ 'ADMIN.USERS.DEACTIVATE' | translate }}</button>
                <button type="button" (click)="admin.setUserStatus(user.id, 'blocked')" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">{{ 'ADMIN.USERS.BLOCK' | translate }}</button>
              </div>
            </div>
          </div>
          <ng-template #noEmployers><p class="text-gray-400 rtl:text-right">{{ 'COMMON.NO_DATA' | translate }}</p></ng-template>
        </div>
      </div>
    </section>
  `,
})
export class AdminUsersPageComponent {
  readonly admin = inject(AdminDashboardService);
  readonly languageService = inject(LanguageService);

  private readonly userNameKeyMap: Record<string, string> = {
    'Ahmed Hassan': 'CANDIDATE.USER.NAME.AHMED_HASSAN',
  };

  private readonly companyKeyMap: Record<string, string> = {
    'TechNova Solutions': 'JOBS.CARD.COMPANIES.TECHNOVA_SOLUTIONS',
  };

  private readonly titleKeyMap: Record<string, string> = {
    'HR Manager': 'ADMIN.USERS.TITLES.HR_MANAGER',
  };

  private readonly locationKeyMap: Record<string, string> = {
    'Cairo, Egypt': 'JOBS.CARD.LOCATIONS.CAIRO_EGYPT',
  };

  nameKey(value: string | undefined): string | null {
    return value ? this.userNameKeyMap[value] ?? null : null;
  }

  companyKey(value: string | undefined): string | null {
    return value ? this.companyKeyMap[value] ?? null : null;
  }

  titleKey(value: string | undefined): string | null {
    return value ? this.titleKeyMap[value] ?? null : null;
  }

  locationKey(value: string | undefined): string | null {
    return value ? this.locationKeyMap[value] ?? null : null;
  }

  statusKey(status: string | undefined): string {
    const normalized = (status ?? 'active').toUpperCase();
    return `ADMIN.USERS.STATUS.${normalized}`;
  }
}
