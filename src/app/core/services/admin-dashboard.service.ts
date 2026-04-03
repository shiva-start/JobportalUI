import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { CandidateFreelancerRequestService } from './candidate-freelancer-request.service';
import { FreelancerRequestService } from './freelancer-request.service';
import { FreelancerService } from './freelancer.service';
import { JobService } from './job.service';
import { PlatformReport, User } from '../../models';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly auth = inject(AuthService);
  private readonly jobs = inject(JobService);
  private readonly freelancers = inject(FreelancerService);
  private readonly freelancerRequests = inject(FreelancerRequestService);
  private readonly candidateFreelancerRequests = inject(CandidateFreelancerRequestService);

  private readonly _reports = signal<PlatformReport[]>([
    { id: 'r1', type: 'job', subject: 'Suspicious salary mismatch in Backend Engineer posting', status: 'open', createdAt: '2026-04-02' },
    { id: 'r2', type: 'user', subject: 'Candidate reported spam outreach from recruiter', status: 'reviewed', createdAt: '2026-04-01' },
    { id: 'r3', type: 'content', subject: 'Inappropriate wording flagged in sales job description', status: 'resolved', createdAt: '2026-03-29' },
  ]);

  readonly users = computed(() => this.auth.listUsers());
  readonly candidates = computed(() => this.users().filter(user => user.role === 'candidate'));
  readonly employers = computed(() => this.users().filter(user => user.role === 'employer'));
  readonly jobsList = computed(() => this.jobs.listJobs());
  readonly freelancersList = computed(() => this.freelancers.list());
  readonly freelancerRequestsList = computed(() => this.freelancerRequests.list());
  readonly candidateFreelancerRequestsList = computed(() => this.candidateFreelancerRequests.list());
  readonly reports = computed(() => this._reports());

  readonly companies = computed(() =>
    this.employers().map(employer => ({
      id: employer.id,
      company: employer.company || employer.name,
      owner: employer.name,
      email: employer.email,
      status: employer.accountStatus ?? 'active',
      location: employer.location ?? 'No data available',
    })),
  );

  readonly stats = computed(() => [
    { label: 'Total Users', value: this.users().length },
    { label: 'Total Jobs', value: this.jobsList().length },
    { label: 'Total Applications', value: this.jobs.totalApplications() },
    { label: 'Active Freelancers', value: this.freelancers.activeCount() },
    { label: 'Pending Requests', value: this.freelancerRequests.pendingCount() + this.candidateFreelancerRequestsList().filter(item => item.status === 'pending').length },
  ]);

  readonly analytics = computed(() => [
    { label: 'Candidate Growth', value: `+${this.candidates().length * 12}%`, detail: 'Compared to last month' },
    { label: 'Hiring Companies', value: this.employers().length, detail: 'Active employer accounts' },
    { label: 'Approved Jobs', value: this.jobsList().filter(job => job.moderationStatus === 'approved').length, detail: 'Visible on platform' },
    { label: 'Open Reports', value: this.reports().filter(report => report.status === 'open').length, detail: 'Require moderation' },
  ]);

  readonly flaggedContent = computed(() => this._reports().filter(report => report.status !== 'resolved'));

  setUserStatus(userId: string, status: User['accountStatus']): void {
    this.auth.updateUser(userId, { accountStatus: status });
  }

  deleteUser(userId: string): void {
    this.auth.removeUser(userId);
  }

  updateCompanyStatus(userId: string, status: User['accountStatus']): void {
    this.auth.updateUser(userId, { accountStatus: status });
  }

  updateJobStatus(jobId: string, status: 'approved' | 'pending' | 'rejected'): void {
    this.jobs.updateModerationStatus(jobId, status);
  }

  removeJob(jobId: string): void {
    this.jobs.removeJob(jobId);
  }

  updateFreelancerStatus(id: string, status: 'pending' | 'approved' | 'rejected'): void {
    this.freelancers.updateStatus(id, status);
  }

  approveCandidateFreelancer(requestId: string, userId: string): void {
    this.candidateFreelancerRequests.updateStatus(requestId, 'approved');
    this.auth.setFreelancerStatus(userId, true);
    this.auth.updateUser(userId, { accountStatus: 'active' });
  }

  rejectCandidateFreelancer(requestId: string): void {
    this.candidateFreelancerRequests.updateStatus(requestId, 'rejected');
  }

  approveFreelancerRequest(requestId: string, freelancerId: string): void {
    const freelancer = this.freelancers.getById(freelancerId);
    if (!freelancer) {
      return;
    }
    this.freelancers.assignFreelancerToRequest(freelancerId, requestId);
    this.freelancerRequests.assignFreelancer(requestId, freelancerId);
    this.freelancerRequests.setFreelancerName(requestId, freelancer.name);
  }

  rejectFreelancerRequest(requestId: string): void {
    this.freelancerRequests.updateStatus(requestId, 'rejected');
  }

  resolveReport(reportId: string): void {
    this._reports.update(list => list.map(report => report.id === reportId ? { ...report, status: 'resolved' } : report));
  }
}
