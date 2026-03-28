import { Injectable, signal, computed } from '@angular/core';
import { Job, JobFilter, Category } from '../../models';
import jobsData from '../../mock-data/jobs.json';
import categoriesData from '../../mock-data/categories.json';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly _jobs = signal<Job[]>(jobsData as Job[]);
  private readonly _savedJobIds = signal<string[]>([]);
  private readonly _appliedJobIds = signal<string[]>([]);
  private readonly _filters = signal<JobFilter>({
    keyword: '',
    location: '',
    category: '',
    experienceLevel: '',
    type: ''
  });

  readonly savedJobIds = computed(() => this._savedJobIds());
  readonly appliedJobIds = computed(() => this._appliedJobIds());

  readonly featuredJobs = computed(() =>
    this._jobs().filter(j => j.featured).slice(0, 6)
  );

  readonly categories: Category[] = categoriesData as Category[];

  readonly filteredJobs = computed(() => {
    const f = this._filters();
    return this._jobs().filter(job => {
      const matchesKeyword = !f.keyword ||
        job.title.toLowerCase().includes(f.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(f.keyword.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(f.keyword.toLowerCase()));
      const matchesLocation = !f.location ||
        job.location.toLowerCase().includes(f.location.toLowerCase());
      const matchesCategory = !f.category || job.category === f.category;
      const matchesLevel = !f.experienceLevel || job.experienceLevel === f.experienceLevel;
      const matchesType = !f.type || job.type === f.type;
      return matchesKeyword && matchesLocation && matchesCategory && matchesLevel && matchesType;
    });
  });

  getJobById(id: string): Job | undefined {
    return this._jobs().find(j => j.id === id);
  }

  setFilters(filters: Partial<JobFilter>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  resetFilters(): void {
    this._filters.set({ keyword: '', location: '', category: '', experienceLevel: '', type: '' });
  }

  getFilters() {
    return this._filters();
  }

  toggleSaveJob(jobId: string): void {
    this._savedJobIds.update(ids =>
      ids.includes(jobId) ? ids.filter(id => id !== jobId) : [...ids, jobId]
    );
  }

  isJobSaved(jobId: string): boolean {
    return this._savedJobIds().includes(jobId);
  }

  applyToJob(jobId: string): void {
    this._appliedJobIds.update(ids =>
      ids.includes(jobId) ? ids : [...ids, jobId]
    );
  }

  isJobApplied(jobId: string): boolean {
    return this._appliedJobIds().includes(jobId);
  }

  getSavedJobs(): Job[] {
    return this._jobs().filter(j => this._savedJobIds().includes(j.id));
  }

  getAppliedJobs(): Job[] {
    return this._jobs().filter(j => this._appliedJobIds().includes(j.id));
  }

  getRelatedJobs(job: Job): Job[] {
    return this._jobs()
      .filter(j => j.id !== job.id && (j.category === job.category || j.experienceLevel === job.experienceLevel))
      .slice(0, 3);
  }
}
