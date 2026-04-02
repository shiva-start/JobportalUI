import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreelancerService } from '../../core/services/freelancer.service';
import { FreelancerRequestService } from '../../core/services/freelancer-request.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <h1 class="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>

      <section class="bg-white p-6 rounded-xl border border-slate-100">
        <h2 class="text-lg font-medium mb-4">Freelancer Management</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let f of freelancers()" class="p-4 border rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold">{{ f.name }} <span class="text-sm text-slate-500">({{ f.role }})</span></div>
                <div class="text-sm text-slate-500">Status: <span [class]="statusClass(f.status)">{{ f.status }}</span></div>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="updateStatus(f.id, 'approved')" class="px-3 py-1 rounded bg-green-100 text-green-700">Approve</button>
                <button (click)="updateStatus(f.id, 'rejected')" class="px-3 py-1 rounded bg-red-100 text-red-700">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white p-6 rounded-xl border border-slate-100">
        <h2 class="text-lg font-medium mb-4">Freelancer Requests</h2>
        <div *ngIf="requests().length === 0" class="text-sm text-slate-500">No requests yet.</div>
        <div *ngFor="let r of requests()" class="p-4 border rounded-lg mb-3">
          <div class="flex items-start justify-between">
            <div>
              <div class="font-semibold">{{ r.employerEmail }} <span class="text-sm text-slate-500">— {{ r.description }}</span></div>
              <div class="text-sm text-slate-500">Skills: {{ r.skills.join(', ') }} • Duration: {{ r.duration || '—' }}</div>
              <div class="text-sm mt-2">Status: <span class="font-medium">{{ r.status }}</span></div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div *ngIf="r.status === 'pending'">
                <label class="block text-xs text-slate-600 mb-1">Assign</label>
                <select #sel class="rounded border-gray-200 p-1 text-sm">
                  <option value="">Select freelancer</option>
                  <option *ngFor="let f of freelancers()" [value]="f.id">{{ f.name }} — {{ f.role }} ({{ f.status }})</option>
                </select>
                <div class="mt-2">
                  <button (click)="assign(r.id, sel.value)" class="px-3 py-1 bg-blue-600 text-white rounded">Assign</button>
                </div>
              </div>
              <div *ngIf="r.status !== 'pending'" class="text-sm text-slate-500">Assigned: {{ r.freelancerId || '—' }}</div>
              <div class="mt-2">
                <button (click)="updateRequestStatus(r.id, 'rejected')" class="px-3 py-1 rounded bg-red-50 text-red-700">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class AdminComponent {
  private fs = inject(FreelancerService);
  private rs = inject(FreelancerRequestService);
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    if (!this.auth.isAuthenticated() || !this.auth.isAdmin()) {
      // Redirect non-admin users to home
      this.router.navigate(['/']);
    }
  }

  freelancers = () => this.fs.list();
  requests = () => this.rs.list();

  updateStatus(id: string, status: 'approved' | 'rejected') {
    this.fs.updateStatus(id, status);
  }

  updateRequestStatus(id: string, status: any) {
    this.rs.updateStatus(id, status);
  }

  assign(requestId: string, freelancerId: string) {
    if (!freelancerId) return;
    this.fs.assignFreelancerToRequest(freelancerId, requestId);
    this.rs.assignFreelancer(requestId, freelancerId);
  }

  statusClass(s: string) {
    if (s === 'approved') return 'text-green-600 font-medium';
    if (s === 'pending') return 'text-yellow-600 font-medium';
    return 'text-red-600 font-medium';
  }
}
