import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-requests-page-localized',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <section [attr.dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="space-y-6">
      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'ADMIN.REQUESTS.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.REQUESTS.SUBTITLE' | translate }}</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h3 class="font-semibold mb-2 rtl:text-right">{{ 'ADMIN.REQUESTS.PENDING_EMPLOYER_REQUESTS' | translate }}</h3>
        <div *ngIf="admin.freelancerRequestsList().length; else noFreelancerRequests" class="space-y-4">
          <div *ngFor="let request of admin.freelancerRequestsList()" class="rounded-xl border border-gray-100 p-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-gray-900">{{ request.employerName || request.employerEmail }}</p>
                <p class="text-sm text-gray-500">{{ request.message || request.description }}</p>
                <p class="mt-1 text-xs text-gray-400">{{ 'ADMIN.REQUESTS.SKILLS' | translate }}: {{ request.skills.join(', ') }}</p>
                <p class="mt-1 text-xs text-gray-400">
                  {{ 'ADMIN.REQUESTS.STATUS' | translate }}: {{ request.status }}
                  <span *ngIf="request.freelancerName">
                    · {{ 'ADMIN.REQUESTS.ASSIGNED' | translate }}
                    {{ freelancerNameKey(request.freelancerName) ? (freelancerNameKey(request.freelancerName)! | translate) : request.freelancerName }}
                  </span>
                </p>
              </div>
              <div class="min-w-[220px]">
                <select [(ngModel)]="selectedFreelancers[request.id]" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <option value="">{{ 'ADMIN.REQUESTS.ASSIGN_FREELANCER' | translate }}</option>
                  <option *ngFor="let freelancer of approvedFreelancers()" [value]="freelancer.id">
                    {{ freelancerNameKey(freelancer.name) ? (freelancerNameKey(freelancer.name)! | translate) : freelancer.name }} - {{ freelancer.role }}
                  </option>
                </select>
                <div class="mt-3 flex flex-wrap gap-2">
                  <button type="button" (click)="approve(request.id)" class="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">{{ 'ADMIN.REQUESTS.APPROVE' | translate }}</button>
                  <button type="button" (click)="admin.rejectFreelancerRequest(request.id)" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">{{ 'ADMIN.REQUESTS.REJECT' | translate }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ng-template #noFreelancerRequests><p class="text-gray-400 rtl:text-right">{{ 'ADMIN.REQUESTS.NO_DATA' | translate }}</p></ng-template>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h3 class="font-semibold mb-2 rtl:text-right">{{ 'ADMIN.REQUESTS.FREELANCER_DIRECTORY' | translate }}</h3>
        <div *ngIf="approvedFreelancers().length; else noDirectory" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let freelancer of approvedFreelancers()" class="rounded-xl border border-gray-100 p-4">
            <p class="font-semibold text-gray-900 rtl:text-right">{{ freelancerNameKey(freelancer.name) ? (freelancerNameKey(freelancer.name)! | translate) : freelancer.name }}</p>
            <p class="text-sm text-gray-500 rtl:text-right">{{ freelancer.role }}</p>
            <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ freelancer.description }}</p>
            <p class="mt-2 text-xs text-gray-400 rtl:text-right">{{ 'ADMIN.REQUESTS.SKILLS' | translate }}: {{ freelancer.skills.join(', ') }}</p>
          </div>
        </div>
        <ng-template #noDirectory><p class="text-gray-400 rtl:text-right">{{ 'ADMIN.REQUESTS.NO_DATA' | translate }}</p></ng-template>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h3 class="font-semibold mb-2 rtl:text-right">{{ 'ADMIN.REQUESTS.CANDIDATE_FREELANCER_APPLICATIONS' | translate }}</h3>
        <div *ngIf="admin.candidateFreelancerRequestsList().length; else noCandidateRequests" class="space-y-3">
          <div *ngFor="let request of admin.candidateFreelancerRequestsList()" class="rounded-xl border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-900">{{ request.userId }}</p>
              <p class="text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.REQUESTS.SUBMITTED' | translate }} {{ request.createdAt | date:'mediumDate' }}</p>
              <p class="text-xs text-gray-400 rtl:text-right">{{ 'ADMIN.REQUESTS.STATUS' | translate }}: {{ request.status }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" (click)="admin.approveCandidateFreelancer(request.id, request.userId)" class="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">{{ 'ADMIN.REQUESTS.APPROVE' | translate }}</button>
              <button type="button" (click)="admin.rejectCandidateFreelancer(request.id)" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">{{ 'ADMIN.REQUESTS.REJECT' | translate }}</button>
            </div>
          </div>
        </div>
        <ng-template #noCandidateRequests><p class="text-gray-400 rtl:text-right">{{ 'ADMIN.REQUESTS.NO_DATA' | translate }}</p></ng-template>
      </div>
    </section>
  `,
})
export class AdminRequestsPageLocalizedComponent {
  readonly admin = inject(AdminDashboardService);
  readonly languageService = inject(LanguageService);
  selectedFreelancers: Record<string, string> = {};

  private readonly freelancerNameKeyMap: Record<string, string> = {
    'Aisha Khan': 'FREELANCERS.CARD.NAMES.AISHA_KHAN',
    'Omar Rizvi': 'FREELANCERS.CARD.NAMES.OMAR_RIZVI',
    'Lina Ahmed': 'FREELANCERS.CARD.NAMES.LINA_AHMED',
    'Samir Patel': 'FREELANCERS.CARD.NAMES.SAMIR_PATEL',
    'Priya Sharma': 'FREELANCERS.CARD.NAMES.PRIYA_SHARMA',
    'Zaid Hassan': 'FREELANCERS.CARD.NAMES.ZAID_HASSAN',
  };

  approvedFreelancers() {
    return this.admin.freelancersList().filter(freelancer => freelancer.status === 'approved');
  }

  freelancerNameKey(name: string | null | undefined): string | null {
    if (!name) {
      return null;
    }

    return this.freelancerNameKeyMap[name] ?? null;
  }

  approve(requestId: string): void {
    const freelancerId = this.selectedFreelancers[requestId];
    if (!freelancerId) {
      return;
    }

    this.admin.approveFreelancerRequest(requestId, freelancerId);
  }
}
