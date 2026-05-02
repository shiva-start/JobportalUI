import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdminDashboardStats, AdminReport, AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <div class="rounded-xl bg-white p-4 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="mt-2 text-sm text-gray-500">Live platform data from backend APIs.</p>
      </div>

      <div *ngIf="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <p class="text-sm text-gray-500">Total Users</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
        </div>
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <p class="text-sm text-gray-500">Total Jobs</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.totalJobs }}</p>
        </div>
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <p class="text-sm text-gray-500">Total Companies</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.totalCompanies }}</p>
        </div>
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <p class="text-sm text-gray-500">Total Reports</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.totalReports }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div class="rounded-xl bg-white p-4 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Users</h2>
          <p class="mt-1 text-sm text-gray-500">Count: {{ users.length }}</p>
          <p *ngIf="!loading && !users.length" class="mt-3 text-sm text-gray-400">No users found.</p>
        </div>

        <div class="rounded-xl bg-white p-4 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900">Jobs</h2>
          <p class="mt-1 text-sm text-gray-500">Count: {{ jobs.length }}</p>
          <p *ngIf="!loading && !jobs.length" class="mt-3 text-sm text-gray-400">No jobs found.</p>
        </div>
      </div>

      <div class="rounded-xl bg-white p-4 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Reports</h2>
          <span class="text-sm text-gray-500">Total: {{ reports.length }}</span>
        </div>

        <p *ngIf="loading" class="text-sm text-gray-500">Loading data...</p>

        <div *ngIf="!loading && reports.length; else emptyReports" class="space-y-3">
          <div *ngFor="let report of reports" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
            <div>
              <p class="font-medium text-gray-900">{{ report.reason }}</p>
              <p class="text-xs text-gray-500">{{ report.createdAt | date:'medium' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full px-2 py-1 text-xs font-semibold" [class]="report.isResolved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                {{ report.isResolved ? 'Resolved' : 'Pending' }}
              </span>
              <button
                type="button"
                class="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                [disabled]="report.isResolved || resolvingIds.has(report.id)"
                (click)="onResolve(report.id)"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
        <ng-template #emptyReports>
          <p *ngIf="!loading" class="text-sm text-gray-400">No reports found.</p>
        </ng-template>
      </div>
    </section>
  `,
})
export class AdminDashboardPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  loading = false;
  errorMessage = '';
  resolvingIds = new Set<string>();

  stats: AdminDashboardStats = {
    totalUsers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalReports: 0,
  };

  users: unknown[] = [];
  jobs: unknown[] = [];
  reports: AdminReport[] = [];

  ngOnInit(): void {
    this.loadAllData();
  }

  onResolve(id: string): void {
    this.resolvingIds.add(id);
    this.errorMessage = '';

    this.adminService.resolveReport(id).subscribe({
      next: () => this.loadAllData(),
      error: (error: HttpErrorResponse) => {
        this.resolvingIds.delete(id);
        this.errorMessage = this.toErrorMessage(error);
      },
    });
  }

  private loadAllData(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      stats: this.adminService.getDashboardStats(),
      users: this.adminService.getUsers(),
      jobs: this.adminService.getJobs(),
      reports: this.adminService.getReports(),
    }).subscribe({
      next: (result) => {
        this.stats = result.stats ?? this.stats;
        this.users = result.users ?? [];
        this.jobs = result.jobs ?? [];
        this.reports = result.reports ?? [];
        this.resolvingIds.clear();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = this.toErrorMessage(error);
      },
    });
  }

  private toErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Unauthorized. Please log in again.';
    }
    if (error.status === 500) {
      return 'Server error occurred. Please try again.';
    }
    return 'Unable to load admin data right now.';
  }
}
