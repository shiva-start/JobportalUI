import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';

@Component({
  selector: 'app-admin-companies-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white rounded-xl shadow-sm p-4">
      <h1 class="mb-4 text-2xl font-bold text-gray-900">Companies</h1>
      <div *ngIf="admin.companies().length; else empty" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let company of admin.companies()" class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p class="font-semibold text-gray-900">{{ company.company }}</p>
          <p class="text-sm text-gray-500">{{ company.owner }}</p>
          <p class="mt-1 text-sm text-gray-400">{{ company.location }}</p>
          <p class="mt-3 text-xs text-gray-400">Status: {{ company.status }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button type="button" (click)="admin.updateCompanyStatus(company.id, 'active')" class="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700">Approve</button>
            <button type="button" (click)="admin.updateCompanyStatus(company.id, 'blocked')" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Block</button>
            <button type="button" class="px-3 py-1 rounded-lg text-sm font-medium bg-slate-100 text-slate-700">Edit</button>
          </div>
        </div>
      </div>
      <ng-template #empty><p class="text-gray-400">No data available</p></ng-template>
    </section>
  `,
})
export class AdminCompaniesPageComponent {
  readonly admin = inject(AdminDashboardService);
}
