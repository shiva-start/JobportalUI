import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

type Tab = 'overview' | 'post-job' | 'jobs' | 'applicants';

type PostedJob = {
  title: string;
  type: 'full-time' | 'contract' | 'remote';
  applicants: number;
  views: number;
  postedKey: string;
  active: boolean;
};

type ApplicantStatus = 'new' | 'reviewed' | 'shortlisted';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BadgeComponent, TranslatePipe],
  templateUrl: './employer-dashboard.component.html'
})
export class EmployerDashboardComponent implements OnInit {
  auth = inject(AuthService);
  jobService = inject(JobService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  activeTab = signal<Tab>('overview');
  jobPosting = signal(false);

  navItems = [
    { id: 'overview' as Tab, svgPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', labelKey: 'EMPLOYER.NAV.OVERVIEW', badge: null },
    { id: 'post-job' as Tab, svgPath: 'M12 4v16m8-8H4', labelKey: 'EMPLOYER.NAV.POST_JOB', badge: null },
    { id: 'jobs' as Tab, svgPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', labelKey: 'EMPLOYER.NAV.MANAGE_JOBS', badge: null },
    { id: 'applicants' as Tab, svgPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', labelKey: 'EMPLOYER.NAV.APPLICANTS', badge: '12' },
  ];

  categories = ['Technology', 'Design', 'Marketing', 'Sales', 'Data & AI', 'Product', 'Human Resources', 'Finance'];

  stats = [
    { svgPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', value: 5, labelKey: 'EMPLOYER.STATS.ACTIVE_POSTINGS', changeKey: 'EMPLOYER.STATS.CHANGE_THIS_MONTH' },
    { svgPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', value: 142, labelKey: 'EMPLOYER.STATS.TOTAL_APPLICANTS', changeKey: 'EMPLOYER.STATS.CHANGE_THIS_WEEK' },
    { svgPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', value: '3.2K', labelKey: 'EMPLOYER.STATS.TOTAL_VIEWS', changeKey: 'EMPLOYER.STATS.CHANGE_PERCENT' },
    { svgPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', value: 7, labelKey: 'EMPLOYER.STATS.HIRES_MADE', changeKey: null },
  ];

  postedJobs: PostedJob[] = [
    { title: 'Senior Frontend Developer', type: 'full-time', applicants: 47, views: 312, postedKey: 'EMPLOYER.POSTED.THREE_DAYS_AGO', active: true },
    { title: 'Product Designer', type: 'full-time', applicants: 23, views: 178, postedKey: 'EMPLOYER.POSTED.ONE_WEEK_AGO', active: true },
    { title: 'Backend Engineer', type: 'contract', applicants: 38, views: 241, postedKey: 'EMPLOYER.POSTED.TWO_WEEKS_AGO', active: true },
    { title: 'Data Analyst', type: 'full-time', applicants: 19, views: 134, postedKey: 'EMPLOYER.POSTED.THREE_WEEKS_AGO', active: false },
    { title: 'DevOps Engineer', type: 'remote', applicants: 15, views: 98, postedKey: 'EMPLOYER.POSTED.ONE_MONTH_AGO', active: false },
  ];

  recentApplicants = [
    { avatar: 'AH', name: 'Ahmed Hassan', title: 'Senior Frontend Developer', job: 'Senior Frontend Developer', status: 'new' as ApplicantStatus },
    { avatar: 'SM', name: 'Sara Mohamed', title: 'Product Designer', job: 'Product Designer', status: 'reviewed' as ApplicantStatus },
    { avatar: 'KA', name: 'Khaled Ahmed', title: 'Full Stack Developer', job: 'Backend Engineer', status: 'shortlisted' as ApplicantStatus },
    { avatar: 'NM', name: 'Nour Mahmoud', title: 'Data Scientist', job: 'Data Analyst', status: 'new' as ApplicantStatus },
    { avatar: 'TK', name: 'Tarek Khalil', title: 'DevOps Engineer', job: 'DevOps Engineer', status: 'reviewed' as ApplicantStatus },
    { avatar: 'RI', name: 'Rana Ibrahim', title: 'UI/UX Designer', job: 'Product Designer', status: 'new' as ApplicantStatus },
  ];

  jobForm = this.fb.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    type: ['', Validators.required],
    location: ['', Validators.required],
    experienceLevel: ['', Validators.required],
    salary: [''],
    description: ['', Validators.required],
    skills: [''],
  });

  get jf() { return this.jobForm.controls; }

  ngOnInit(): void {
    const tab = this.route.snapshot.data['tab'] as Tab | undefined;
    if (tab) {
      this.activeTab.set(tab);
    }
  }

  onPostJob(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }
    this.jobPosting.set(true);
    setTimeout(() => {
      this.jobPosting.set(false);
      this.toastService.success(this.translate.instant('EMPLOYER.TOASTS.JOB_POSTED'));
      this.jobForm.reset();
      this.activeTab.set('jobs');
    }, 1200);
  }

  categoryKey(category: string): string {
    return `HOME.CATEGORIES.ITEMS.${category.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
  }

  typeKey(type: PostedJob['type']): string {
    return `JOBS.TYPES.${type.toUpperCase().replace(/-/g, '_')}`;
  }

  experienceKey(level: string): string {
    return `JOBS.LEVELS.${level.toUpperCase()}`;
  }

  applicantStatusKey(status: ApplicantStatus): string {
    return `EMPLOYER.STATUS.${status.toUpperCase()}`;
  }

  jobStatusKey(active: boolean): string {
    return active ? 'EMPLOYER.STATUS.ACTIVE' : 'EMPLOYER.STATUS.CLOSED';
  }
}
