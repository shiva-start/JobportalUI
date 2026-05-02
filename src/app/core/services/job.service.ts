import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApplicationStatus, ApplicationRecord, Category, Job, JobFilter } from '../../models';
import { ApplicationsService, JobApplicationDto } from './applications.service';
import { JobsService } from './jobs.service';
import { SavedJobsService } from './saved-jobs.service';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly jobsApi = inject(JobsService);
  private readonly applicationsApi = inject(ApplicationsService);
  private readonly savedJobsApi = inject(SavedJobsService);

  private readonly applicationStatusAliases: Record<string, ApplicationStatus> = {
    submitted: 'applied',
    reviewing: 'under-review',
    shortlisted: 'shortlisted',
    rejected: 'rejected',
    hired: 'selected',
    withdrawn: 'rejected',
    applied: 'applied',
    'under-review': 'under-review',
    'under review': 'under-review',
    'interview-scheduled': 'interview-scheduled',
    interview: 'interview-scheduled',
    selected: 'selected',
  };

  private readonly applicationStatusKeyMap: Record<ApplicationStatus, string> = {
    applied: 'CANDIDATE.STATUS.APPLIED',
    'under-review': 'CANDIDATE.STATUS.UNDER_REVIEW',
    shortlisted: 'CANDIDATE.STATUS.SHORTLISTED',
    'interview-scheduled': 'CANDIDATE.STATUS.INTERVIEW_SCHEDULED',
    rejected: 'CANDIDATE.STATUS.REJECTED',
    selected: 'CANDIDATE.STATUS.SELECTED',
  };

  private readonly _jobs = signal<Job[]>([]);
  private readonly _savedJobIds = signal<string[]>([]);
  private readonly _appliedJobIds = signal<string[]>([]);
  private readonly _applicationDetails = signal<ApplicationRecord[]>([]);
  private readonly _filters = signal<JobFilter>({
    keyword: '',
    location: '',
    category: '',
    experienceLevel: '',
    type: '',
  });

  readonly savedJobIds = computed(() => this._savedJobIds());
  readonly appliedJobIds = computed(() => this._appliedJobIds());
  readonly jobs = computed(() => this._jobs());

  // Category cards are still UI presets; job list itself is API-backed.
  readonly categories: Category[] = [
    { id: 'software-development', name: 'Software Development', icon: 'code', count: 0, color: 'blue' },
    { id: 'marketing', name: 'Marketing', icon: 'megaphone', count: 0, color: 'emerald' },
    { id: 'finance', name: 'Finance', icon: 'chart', count: 0, color: 'amber' },
  ];

  readonly featuredJobs = computed(() => this._jobs().slice(0, 6));
  readonly filteredJobs = computed(() => {
    const f = this._filters();
    return this._jobs().filter((job) => {
      const matchesKeyword = !f.keyword ||
        job.title.toLowerCase().includes(f.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(f.keyword.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(f.keyword.toLowerCase()));
      const matchesLocation = !f.location || job.location.toLowerCase().includes(f.location.toLowerCase());
      const matchesCategory = !f.category || job.category.toLowerCase().includes(f.category.toLowerCase());
      const matchesLevel = !f.experienceLevel || job.experienceLevel === f.experienceLevel;
      const matchesType = !f.type || job.type === f.type;
      return matchesKeyword && matchesLocation && matchesCategory && matchesLevel && matchesType;
    });
  });

  constructor() {
    this.refreshCatalog();
    this.refreshCandidateData();
  }

  getJobById(id: string): Job | undefined {
    return this._jobs().find((j) => j.id === id);
  }

  listJobs(): Job[] {
    return this._jobs();
  }

  setFilters(filters: Partial<JobFilter>): void {
    this._filters.update((current) => ({ ...current, ...filters }));
  }

  resetFilters(): void {
    this._filters.set({ keyword: '', location: '', category: '', experienceLevel: '', type: '' });
  }

  getFilters(): JobFilter {
    return this._filters();
  }

  toggleSaveJob(jobId: string): void {
    this.savedJobsApi.toggleSaveJob(jobId).pipe(
      tap((result) => {
        this._savedJobIds.update((ids) =>
          result.isSaved ? [...new Set([...ids, result.jobId])] : ids.filter((id) => id !== result.jobId),
        );
      }),
      catchError(() => of(null)),
    ).subscribe();
  }

  isJobSaved(jobId: string): boolean {
    return this._savedJobIds().includes(jobId);
  }

  applyToJob(jobId: string): void {
    this.applicationsApi.applyToJob({ jobId }).pipe(
      tap((created) => this.upsertApplication(created)),
      catchError(() => of(null)),
    ).subscribe();
  }

  isJobApplied(jobId: string): boolean {
    return this._appliedJobIds().includes(jobId);
  }

  getSavedJobs(): Job[] {
    const saved = new Set(this._savedJobIds());
    return this._jobs().filter((j) => saved.has(j.id));
  }

  getAppliedJobs(): Job[] {
    const applied = new Set(this._appliedJobIds());
    return this._jobs().filter((j) => applied.has(j.id));
  }

  getApplicationDetails(): ApplicationRecord[] {
    return this._applicationDetails();
  }

  totalApplications(): number {
    return this._applicationDetails().length;
  }

  getApplicationStatus(jobId: string): ApplicationStatus {
    const rawStatus = this._applicationDetails().find((a) => a.jobId === jobId)?.status ?? 'applied';
    return this.normalizeApplicationStatus(rawStatus);
  }

  getApplicationDate(jobId: string): string {
    const detail = this._applicationDetails().find((a) => a.jobId === jobId);
    if (!detail) return '';
    const date = new Date(detail.appliedAt);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatApplicationStatus(status: ApplicationStatus): string {
    const map: Record<ApplicationStatus, string> = {
      applied: 'Applied',
      'under-review': 'Under Review',
      shortlisted: 'Shortlisted',
      'interview-scheduled': 'Interview',
      rejected: 'Rejected',
      selected: 'Selected',
    };
    return map[status];
  }

  getApplicationStatusKey(status: string): string {
    return this.applicationStatusKeyMap[this.normalizeApplicationStatus(status)];
  }

  normalizeApplicationStatus(status: string): ApplicationStatus {
    const normalized = status.trim().toLowerCase().replace(/[_\s]+/g, '-');
    return this.applicationStatusAliases[normalized] ?? 'applied';
  }

  updateModerationStatus(jobId: string, status: Job['moderationStatus']): void {
    this._jobs.update((list) => list.map((job) => (job.id === jobId ? { ...job, moderationStatus: status } : job)));
  }

  removeJob(jobId: string): void {
    this._jobs.update((list) => list.filter((job) => job.id !== jobId));
    this._savedJobIds.update((ids) => ids.filter((id) => id !== jobId));
    this._appliedJobIds.update((ids) => ids.filter((id) => id !== jobId));
    this._applicationDetails.update((list) => list.filter((detail) => detail.jobId !== jobId));
  }

  getRelatedJobs(job: Job): Job[] {
    return this._jobs()
      .filter((j) => j.id !== job.id && (j.category === job.category || j.experienceLevel === job.experienceLevel))
      .slice(0, 3);
  }

  refreshCandidateData(): void {
    forkJoin({
      saved: this.savedJobsApi.getSavedJobIds().pipe(catchError(() => of([] as string[]))),
      applications: this.applicationsApi.getMyApplications().pipe(catchError(() => of([] as JobApplicationDto[]))),
    }).pipe(
      tap(({ saved, applications }) => {
        this._savedJobIds.set(saved);
        this._applicationDetails.set(applications.map((a) => ({
          jobId: a.jobId,
          appliedAt: a.appliedAtUtc,
          status: this.normalizeApplicationStatus(a.status),
        })));
        this._appliedJobIds.set([...new Set(applications.map((a) => a.jobId))]);
      }),
      tap(({ applications }) => this.ensureJobsLoaded(applications.map((a) => a.jobId))),
    ).subscribe();
  }

  private refreshCatalog(): void {
    this.jobsApi.getJobs({ page: 1, pageSize: 100, sortBy: 'posted', descending: true }).pipe(
      map((response) => response.items.map((job) => ({ ...job, moderationStatus: 'approved' as const }))),
      tap((jobs) => this._jobs.set(jobs)),
      catchError(() => of([] as Job[])),
    ).subscribe();
  }

  private ensureJobsLoaded(jobIds: string[]): void {
    const existing = new Set(this._jobs().map((j) => j.id));
    const missing = [...new Set(jobIds)].filter((id) => !existing.has(id));
    if (!missing.length) {
      return;
    }

    forkJoin(
      missing.map((id) =>
        this.jobsApi.getJobById(id).pipe(catchError(() => of(null as Job | null))),
      ),
    ).pipe(
      map((items) => items.filter((item): item is Job => item !== null)),
      tap((loaded) => {
        if (!loaded.length) {
          return;
        }
        this._jobs.update((current) => {
          const byId = new Map(current.map((job) => [job.id, job]));
          loaded.forEach((job) => byId.set(job.id, { ...job, moderationStatus: 'approved' }));
          return [...byId.values()];
        });
      }),
    ).subscribe();
  }

  private upsertApplication(application: JobApplicationDto): void {
    const normalizedStatus = this.normalizeApplicationStatus(application.status);
    this._applicationDetails.update((items) => {
      const existingIndex = items.findIndex((i) => i.jobId === application.jobId);
      const next: ApplicationRecord = {
        jobId: application.jobId,
        appliedAt: application.appliedAtUtc,
        status: normalizedStatus,
      };

      if (existingIndex === -1) {
        return [next, ...items];
      }

      return items.map((item, index) => (index === existingIndex ? next : item));
    });

    this._appliedJobIds.update((ids) => [...new Set([...ids, application.jobId])]);
    this.ensureJobsLoaded([application.jobId]);
  }
}
