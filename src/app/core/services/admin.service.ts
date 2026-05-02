import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface AdminDashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalCompanies: number;
  totalReports: number;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

export interface AdminJob {
  id: string;
  title: string;
  status: string;
  location: string;
  createdAt: string;
  companyId: string;
  companyName: string;
}

export interface AdminReport {
  id: string;
  reason: string;
  isResolved: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.api.get<AdminDashboardStats>('admin/dashboard');
  }

  getUsers(): Observable<AdminUser[]> {
    return this.api.get<AdminUser[]>('admin/users');
  }

  getJobs(): Observable<AdminJob[]> {
    return this.api.get<AdminJob[]>('admin/jobs');
  }

  getReports(): Observable<AdminReport[]> {
    return this.api.get<AdminReport[]>('admin/reports');
  }

  resolveReport(id: string): Observable<AdminReport> {
    return this.api.patch<AdminReport>(`admin/reports/${id}/resolve`, {});
  }
}
