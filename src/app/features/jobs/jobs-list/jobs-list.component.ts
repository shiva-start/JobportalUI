import { Component, HostListener, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Job } from '../../../core/models/job.model';
import { JobsService } from '../../../core/services/jobs.service';
import { ToastService } from '../../../core/services/toast.service';
import { CompaniesService } from '../../../core/services/companies.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { PageHeroComponent } from '../../../shared/components/page-hero/page-hero.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, JobCardComponent, PageHeroComponent, SkeletonComponent],
  templateUrl: './jobs-list.component.html'
})
export class JobsListComponent implements OnInit {
  private readonly jobsService = inject(JobsService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);
  private readonly companiesService = inject(CompaniesService);

  readonly loading = signal(true);
  readonly showFilters = signal(false);
  readonly currentPage = signal(1);
  readonly jobs = signal<Job[]>([]);
  readonly totalJobs = signal(0);
  readonly errorMessage = signal<string | null>(null);
  readonly savedJobIds = signal<string[]>([]);
  readonly selectedCompanyName = signal<string | null>(null);
  readonly companyScopedView = signal(false);
  readonly companyScopedJobs = signal<Job[]>([]);
  selectedCompanyId: string | null = null;

  sortBy: 'posted' | 'salary' = 'posted';
  isDesktop = false;

  @HostListener('window:resize')
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 640;
    }
  }

  filters = {
    keyword: '',
    location: '',
    category: '',
    experienceLevel: '',
    type: ''
  };

  readonly pageSize = 8;

  readonly categories = ['Technology', 'Design', 'Marketing', 'Sales', 'Data & AI', 'Product', 'Human Resources', 'Finance'];

  readonly experienceLevels = [
    { value: '', labelKey: 'JOBS.FILTER.ALL_LEVELS' },
    { value: 'entry', labelKey: 'JOBS.LEVELS.ENTRY' },
    { value: 'mid', labelKey: 'JOBS.LEVELS.MID' },
    { value: 'senior', labelKey: 'JOBS.LEVELS.SENIOR' },
    { value: 'lead', labelKey: 'JOBS.LEVELS.LEAD' },
    { value: 'executive', labelKey: 'JOBS.LEVELS.EXECUTIVE' },
  ];

  readonly jobTypes = [
    { value: '', labelKey: 'JOBS.FILTER.ALL_TYPES' },
    { value: 'full-time', labelKey: 'JOBS.TYPES.FULL_TIME' },
    { value: 'part-time', labelKey: 'JOBS.TYPES.PART_TIME' },
    { value: 'remote', labelKey: 'JOBS.TYPES.REMOTE' },
    { value: 'contract', labelKey: 'JOBS.TYPES.CONTRACT' },
    { value: 'internship', labelKey: 'JOBS.TYPES.INTERNSHIP' },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 640;
    }

    this.route.queryParams.subscribe((params) => {
      this.selectedCompanyId = params['companyId'] ?? null;
      this.companyScopedView.set(!!this.selectedCompanyId);
      this.filters.keyword = params['keyword'] ?? '';
      this.filters.location = params['location'] ?? '';
      this.currentPage.set(1);
      this.resolveSelectedCompanyNameAndLoad();
    });
  }

  paginatedJobs(): Job[] {
    if (this.companyScopedView()) {
      const start = (this.currentPage() - 1) * this.pageSize;
      return this.companyScopedJobs().slice(start, start + this.pageSize);
    }
    return this.jobs();
  }

  totalPages(): number {
    if (this.companyScopedView()) {
      return Math.max(1, Math.ceil(this.companyScopedJobs().length / this.pageSize));
    }
    return Math.max(1, Math.ceil(this.totalJobs() / this.pageSize));
  }

  pageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadJobs();
  }

  clearFilters(): void {
    this.filters = { keyword: '', location: '', category: '', experienceLevel: '', type: '' };
    this.currentPage.set(1);
    this.loadJobs();
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.keyword || this.filters.category || this.filters.experienceLevel || this.filters.type || this.filters.location);
  }

  toggleMobileFilter(): void { this.showFilters.update(v => !v); }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadJobs();
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadJobs();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadJobs();
    }
  }

  onSaveJob(jobId: string): void {
    if (this.isJobSaved(jobId)) {
      this.jobsService.unsaveJob(jobId).subscribe({
        next: () => {
          this.savedJobIds.update(ids => ids.filter(id => id !== jobId));
          this.toastService.success(this.translate.instant('JOBS.TOASTS.REMOVED_SHORT'));
        },
        error: (error) => this.handleError(error),
      });
      return;
    }

    this.jobsService.saveJob(jobId).subscribe({
      next: () => {
        this.savedJobIds.update(ids => [...ids, jobId]);
        this.toastService.success(this.translate.instant('JOBS.TOASTS.SAVED_SHORT'));
      },
      error: (error) => this.handleError(error),
    });
  }

  isJobSaved(jobId: string): boolean {
    return this.savedJobIds().includes(jobId);
  }

  categoryKey(category: string): string {
    return `HOME.CATEGORIES.ITEMS.${category.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
  }

  private loadJobs(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.jobsService.getJobs({
      keyword: this.filters.keyword,
      location: this.filters.location,
      category: this.filters.category,
      experienceLevel: this.filters.experienceLevel,
      type: this.filters.type,
      sortBy: this.sortBy,
      descending: true,
      page: this.companyScopedView() ? 1 : this.currentPage(),
      pageSize: this.companyScopedView() ? 200 : this.pageSize,
    }).subscribe({
      next: (response) => {
        if (this.companyScopedView()) {
          this.filterJobsByCompany(response.items);
          this.loading.set(false);
          return;
        }
        this.jobs.set(response.items);
        this.totalJobs.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        this.jobs.set([]);
        this.totalJobs.set(0);
        this.loading.set(false);
        this.handleError(error);
      },
    });
  }

  private resolveSelectedCompanyNameAndLoad(): void {
    if (!this.selectedCompanyId) {
      this.selectedCompanyName.set(null);
      this.loadJobs();
      return;
    }

    this.companiesService.getCompanies().subscribe({
      next: (companies) => {
        const selected = companies.find((c) => c.id === this.selectedCompanyId);
        this.selectedCompanyName.set(selected?.name ?? null);
        this.loadJobs();
      },
      error: () => {
        this.selectedCompanyName.set(null);
        this.loadJobs();
      }
    });
  }

  private filterJobsByCompany(items: Job[]): void {
    const companyName = (this.selectedCompanyName() ?? '').trim().toLowerCase();
    if (!companyName) {
      this.companyScopedJobs.set([]);
      this.jobs.set([]);
      this.totalJobs.set(0);
      return;
    }

    const filtered = items.filter((job) => (job.company || '').trim().toLowerCase() === companyName);
    this.companyScopedJobs.set(filtered);
    this.jobs.set(filtered);
    this.totalJobs.set(filtered.length);
  }

  private handleError(error: unknown): void {
    const message = error instanceof HttpErrorResponse
      ? (error.error?.message || error.message || this.translate.instant('AUTH.LOGIN.ERROR_TOAST'))
      : this.translate.instant('AUTH.LOGIN.ERROR_TOAST');
    this.errorMessage.set(message);
    this.toastService.error(message);
  }
}

