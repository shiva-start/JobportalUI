import { Component, inject, signal, OnInit, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, FormsModule, JobCardComponent, SkeletonComponent],
  templateUrl: './jobs-list.component.html'
})
export class JobsListComponent implements OnInit {
  jobService = inject(JobService);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  loading = signal(true);
  showFilters = signal(false);
  currentPage = signal(1);
  sortBy = 'recent';
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

  categories = ['Technology', 'Design', 'Marketing', 'Sales', 'Data & AI', 'Product', 'Human Resources', 'Finance'];

  experienceLevels = [
    { value: '', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' },
  ];

  jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'remote', label: 'Remote' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 640;
    }
    const current = this.jobService.getFilters();
    this.filters = { ...current };
    setTimeout(() => this.loading.set(false), 600);
  }

  paginatedJobs() {
    const jobs = this.jobService.filteredJobs();
    const start = (this.currentPage() - 1) * this.pageSize;
    return jobs.slice(start, start + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.jobService.filteredJobs().length / this.pageSize);
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
    this.jobService.setFilters({ ...this.filters });
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.filters = { keyword: '', location: '', category: '', experienceLevel: '', type: '' };
    this.jobService.resetFilters();
    this.currentPage.set(1);
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.keyword || this.filters.category || this.filters.experienceLevel || this.filters.type || this.filters.location);
  }

  toggleMobileFilter(): void { this.showFilters.update(v => !v); }

  goToPage(page: number): void { this.currentPage.set(page); }
  prevPage(): void { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }

  onSaveJob(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
    const saved = this.jobService.isJobSaved(jobId);
    this.toastService.success(saved ? 'Job saved!' : 'Job removed.');
  }
}
