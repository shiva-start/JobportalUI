import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { CandidateFreelancerRequestService } from './candidate-freelancer-request.service';
import { FreelancerRequestService } from './freelancer-request.service';
import { FreelancerService } from './freelancer.service';
import { JobService } from './job.service';
import { PlatformReport, User } from '../../models';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly auth = inject(AuthService);
  private readonly jobs = inject(JobService);
  private readonly freelancers = inject(FreelancerService);
  private readonly freelancerRequests = inject(FreelancerRequestService);
  private readonly candidateFreelancerRequests = inject(CandidateFreelancerRequestService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

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
      location: employer.location ?? this.translateLabel('COMMON.NO_DATA'),
    })),
  );

  readonly stats = computed(() => {
    this.languageService.currentLanguage();

    return [
      { label: this.translateLabel('ADMIN.DASHBOARD.STATS.TOTAL_USERS'), value: this.users().length },
      { label: this.translateLabel('ADMIN.DASHBOARD.STATS.TOTAL_JOBS'), value: this.jobsList().length },
      { label: this.translateLabel('ADMIN.DASHBOARD.STATS.TOTAL_APPLICATIONS'), value: this.jobs.totalApplications() },
      { label: this.translateLabel('ADMIN.DASHBOARD.STATS.ACTIVE_FREELANCERS'), value: this.freelancers.activeCount() },
      {
        label: this.translateLabel('ADMIN.DASHBOARD.STATS.PENDING_REQUESTS'),
        value: this.freelancerRequests.pendingCount() + this.candidateFreelancerRequestsList().filter(item => item.status === 'pending').length,
      },
    ];
  });

  readonly analytics = computed(() => {
    this.languageService.currentLanguage();

    return [
      {
        label: this.translateLabel('ADMIN.DASHBOARD.ANALYTICS.CANDIDATE_GROWTH'),
        value: `+${this.candidates().length * 12}%`,
        detail: this.translateLabel('ADMIN.DASHBOARD.ANALYTICS.CANDIDATE_GROWTH_DETAIL'),
      },
      {
        label: this.translateLabel('ADMIN.DASHBOARD.ANALYTICS.HIRING_COMPANIES'),
        value: this.employers().length,
        detail: this.translateLabel('ADMIN.DASHBOARD.ANALYTICS.HIRING_COMPANIES_DETAIL'),
      },
      {
        label: this.translateLabel('ADMIN.DASHBOARD.ANALYTICS.APPROVED_JOBS'),
        value: this.jobsList().filter(job => job.moderationStatus === 'approved').length,
        detail: this.translateLabel('ADMIN.DASHBOARD.ANALYTICS.APPROVED_JOBS_DETAIL'),
      },
      {
        label: this.translateLabel('ADMIN.DASHBOARD.ANALYTICS.OPEN_REPORTS'),
        value: this.reports().filter(report => report.status === 'open').length,
        detail: this.translateLabel('ADMIN.DASHBOARD.ANALYTICS.OPEN_REPORTS_DETAIL'),
      },
    ];
  });

  readonly flaggedContent = computed(() => {
    this.languageService.currentLanguage();

    return this._reports()
      .filter(report => report.status !== 'resolved')
      .map(report => ({
        ...report,
        subject: this.translateReportSubject(report.subject),
        type: this.translateLabel(`ADMIN.DASHBOARD.REPORT_TYPES.${report.type.toUpperCase()}`),
        status: this.translateLabel(`ADMIN.DASHBOARD.REPORT_STATUS.${report.status.toUpperCase()}`),
      }));
  });

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

  private translateLabel(key: string): string {
    return this.translate.instant(key);
  }

  private translateReportSubject(subject: string): string {
    const subjectMap: Record<string, string> = {
      'Suspicious salary mismatch in Backend Engineer posting': 'ADMIN.DASHBOARD.REPORT_SUBJECTS.SALARY_MISMATCH',
      'Candidate reported spam outreach from recruiter': 'ADMIN.DASHBOARD.REPORT_SUBJECTS.SPAM_OUTREACH',
      'Inappropriate wording flagged in sales job description': 'ADMIN.DASHBOARD.REPORT_SUBJECTS.INAPPROPRIATE_WORDING',
    };

    const key = subjectMap[subject];
    return key ? this.translate.instant(key) : subject;
  }
}
