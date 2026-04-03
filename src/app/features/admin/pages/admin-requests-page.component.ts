import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';

@Component({
  selector: 'app-admin-requests-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="space-y-6">
      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Freelancer Requests</h1>
        <p class="mt-2 text-sm text-gray-500">This is the main admin workflow: review employer freelancer requests and control access.</p>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h3 class="font-semibold mb-2">Pending Employer Requests</h3>
        <div *ngIf="admin.freelancerRequestsList().length; else noFreelancerRequests" class="space-y-4">
          <div *ngFor="let request of admin.freelancerRequestsList()" class="rounded-xl border border-gray-100 p-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-gray-900">{{ request.employerName || request.employerEmail }}</p>
                <p class="text-sm text-gray-500">{{ request.message || request.description }}</p>
                <p class="mt-1 text-xs text-gray-400">Skills: {{ request.skills.join(', ') }}</p>
                <p class="mt-1 text-xs text-gray-400">Status: {{ request.status }}<span *ngIf="request.freelancerName"> · Assigned {{ request.freelancerName }}</span></p>
              </div>
              <div class="min-w-[220px]">
                <select [(ngModel)]="selectedFreelancers[request.id]" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <option value="">Assign freelancer</option>
                  <option *ngFor="let freelancer of approvedFreelancers()" [value]="freelancer.id">{{ freelancer.name }} - {{ freelancer.role }}</option>
                </select>
                <div class="mt-3 flex flex-wrap gap-2">
                  <button type="button" (click)="approve(request.id)" class="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">Approve</button>
                  <button type="button" (click)="admin.rejectFreelancerRequest(request.id)" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ng-template #noFreelancerRequests><p class="text-gray-400">No data available</p></ng-template>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h3 class="font-semibold mb-2">Freelancer Directory</h3>
        <div *ngIf="approvedFreelancers().length; else noDirectory" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let freelancer of approvedFreelancers()" class="rounded-xl border border-gray-100 p-4">
            <p class="font-semibold text-gray-900">{{ freelancer.name }}</p>
            <p class="text-sm text-gray-500">{{ freelancer.role }}</p>
            <p class="mt-2 text-sm text-gray-500">{{ freelancer.description }}</p>
            <p class="mt-2 text-xs text-gray-400">Skills: {{ freelancer.skills.join(', ') }}</p>
          </div>
        </div>
        <ng-template #noDirectory><p class="text-gray-400">No data available</p></ng-template>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm">
        <h3 class="font-semibold mb-2">Candidate Freelancer Applications</h3>
        <div *ngIf="admin.candidateFreelancerRequestsList().length; else noCandidateRequests" class="space-y-3">
          <div *ngFor="let request of admin.candidateFreelancerRequestsList()" class="rounded-xl border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-900">{{ request.userId }}</p>
              <p class="text-sm text-gray-500">Submitted {{ request.createdAt | date:'mediumDate' }}</p>
              <p class="text-xs text-gray-400">Status: {{ request.status }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" (click)="admin.approveCandidateFreelancer(request.id, request.userId)" class="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">Approve</button>
              <button type="button" (click)="admin.rejectCandidateFreelancer(request.id)" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Reject</button>
            </div>
          </div>
        </div>
        <ng-template #noCandidateRequests><p class="text-gray-400">No data available</p></ng-template>
      </div>
    </section>
  `,
})
export class AdminRequestsPageComponent {
  readonly admin = inject(AdminDashboardService);
  selectedFreelancers: Record<string, string> = {};

  approvedFreelancers() {
    return this.admin.freelancersList().filter(freelancer => freelancer.status === 'approved');
  }

  approve(requestId: string): void {
    const freelancerId = this.selectedFreelancers[requestId];
    if (!freelancerId) {
      return;
    }
    this.admin.approveFreelancerRequest(requestId, freelancerId);
  }
}
