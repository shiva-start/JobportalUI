import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="mt-2 text-sm text-gray-500">Centralized platform control, moderation, and freelancer mediation.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of admin.stats()" class="bg-white rounded-xl shadow-sm p-4">
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="font-semibold mb-2">Platform Overview</h3>
          <div *ngFor="let item of admin.analytics()" class="mb-3">
            <p class="text-sm font-medium text-gray-900">{{ item.label }}</p>
            <p class="text-lg font-bold text-gray-900">{{ item.value }}</p>
            <p class="text-xs text-gray-400">{{ item.detail }}</p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="font-semibold mb-2">Freelancer Mediation</h3>
          <div *ngIf="admin.freelancerRequestsList().length; else noRequests">
            <div *ngFor="let request of admin.freelancerRequestsList().slice(0, 3)" class="mb-3 rounded-lg border border-gray-100 p-3">
              <p class="text-sm font-medium text-gray-900">{{ request.employerName || request.employerEmail }}</p>
              <p class="text-sm text-gray-500">{{ request.description }}</p>
              <p class="mt-1 text-xs text-gray-400">Status: {{ request.status }}</p>
            </div>
          </div>
          <ng-template #noRequests><p class="text-gray-400">No data available</p></ng-template>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="font-semibold mb-2">Reports & Complaints</h3>
          <div *ngIf="admin.flaggedContent().length; else noReports">
            <div *ngFor="let report of admin.flaggedContent().slice(0, 3)" class="mb-3 rounded-lg border border-gray-100 p-3">
              <p class="text-sm font-medium text-gray-900">{{ report.subject }}</p>
              <p class="mt-1 text-xs text-gray-400">{{ report.type }} · {{ report.status }}</p>
            </div>
          </div>
          <ng-template #noReports><p class="text-gray-400">No data available</p></ng-template>
        </div>
      </div>
    </section>
  `,
})
export class AdminDashboardPageComponent {
  readonly admin = inject(AdminDashboardService);
}
