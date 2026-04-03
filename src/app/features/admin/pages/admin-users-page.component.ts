import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Candidates</h2>
          <div *ngIf="admin.candidates().length; else noCandidates" class="space-y-3">
            <div *ngFor="let user of admin.candidates()" class="rounded-xl border border-gray-100 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-gray-900">{{ user?.name }}</p>
                  <p class="text-sm text-gray-500">{{ user?.email }}</p>
                  <p class="text-xs text-gray-400">{{ user?.location || 'No data available' }}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{{ user?.accountStatus }}</span>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <button type="button" (click)="admin.setUserStatus(user.id, 'inactive')" class="px-3 py-1 rounded-lg text-sm font-medium bg-amber-100 text-amber-700">Deactivate</button>
                <button type="button" (click)="admin.setUserStatus(user.id, 'blocked')" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Block</button>
              </div>
            </div>
          </div>
          <ng-template #noCandidates><p class="text-gray-400">No data available</p></ng-template>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Employers</h2>
          <div *ngIf="admin.employers().length; else noEmployers" class="space-y-3">
            <div *ngFor="let user of admin.employers()" class="rounded-xl border border-gray-100 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-gray-900">{{ user?.company || user?.name }}</p>
                  <p class="text-sm text-gray-500">{{ user?.email }}</p>
                  <p class="text-xs text-gray-400">{{ user?.title || 'No data available' }}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{{ user?.accountStatus }}</span>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                <button type="button" (click)="admin.setUserStatus(user.id, 'inactive')" class="px-3 py-1 rounded-lg text-sm font-medium bg-amber-100 text-amber-700">Deactivate</button>
                <button type="button" (click)="admin.setUserStatus(user.id, 'blocked')" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Block</button>
              </div>
            </div>
          </div>
          <ng-template #noEmployers><p class="text-gray-400">No data available</p></ng-template>
        </div>
      </div>
    </section>
  `,
})
export class AdminUsersPageComponent {
  readonly admin = inject(AdminDashboardService);
}
