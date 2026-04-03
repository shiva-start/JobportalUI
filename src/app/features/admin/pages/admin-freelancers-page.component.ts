import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';

@Component({
  selector: 'app-admin-freelancers-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h1 class="text-2xl font-bold text-gray-900">Freelancers</h1>
        <p class="mt-2 text-sm text-gray-500">Admin-controlled directory for mediated employer access only.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let freelancer of admin.freelancersList()" class="bg-white rounded-xl shadow-sm p-4">
          <p class="font-semibold text-gray-900">{{ freelancer.name }}</p>
          <p class="text-sm text-gray-500">{{ freelancer.role }}</p>
          <p class="mt-2 text-sm text-gray-500">{{ freelancer.description }}</p>
          <p class="mt-3 text-xs text-gray-400">Skills: {{ freelancer.skills.join(', ') }}</p>
          <p class="mt-1 text-xs text-gray-400">Portfolio: {{ freelancer.portfolio || 'No data available' }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button type="button" (click)="admin.updateFreelancerStatus(freelancer.id, 'approved')" class="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">Approve</button>
            <button type="button" (click)="admin.updateFreelancerStatus(freelancer.id, 'rejected')" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Reject</button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AdminFreelancersPageComponent {
  readonly admin = inject(AdminDashboardService);
}
