import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { JobsService } from '../../core/services/jobs.service';
import { LanguageService } from '../../core/services/language.service';
import { ToastService } from '../../core/services/toast.service';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { CompaniesService } from '../../core/services/companies.service';
import { Company } from '../../core/models/company.model';
import { CreateJobPayload } from '../../core/models/job.model';
import { ApiService } from '../../core/services/api.service';
import { ApplicationsService, JobApplicationDto } from '../../core/services/applications.service';

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

type EmployerQuickAction = {
  route: string;
  titleKey: string;
  subtitleKey: string;
  count: number | null;
  accentClass: string;
  iconPath: string;
};

type JobCategoryOption = {
  id: string;
  name: string;
};

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BadgeComponent, TranslatePipe, RouterLink],
  templateUrl: './employer-dashboard.component.html'
})
export class EmployerDashboardComponent implements OnInit {
  auth = inject(AuthService);
  private readonly jobsService = inject(JobsService);
  private readonly companiesService = inject(CompaniesService);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  readonly languageService = inject(LanguageService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  activeTab = signal<Tab>('overview');
  jobPosting = signal(false);
  companiesLoading = signal(false);
  categoriesLoading = signal(false);
  postJobError = signal<string | null>(null);
  companies = signal<Company[]>([]);
  jobCategories = signal<JobCategoryOption[]>([]);

  navItems = [
    { id: 'overview' as Tab, svgPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', labelKey: 'EMPLOYER.NAV.OVERVIEW', badge: null },
    { id: 'post-job' as Tab, svgPath: 'M12 4v16m8-8H4', labelKey: 'EMPLOYER.NAV.POST_JOB', badge: null },
    { id: 'jobs' as Tab, svgPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', labelKey: 'EMPLOYER.NAV.MANAGE_JOBS', badge: null },
    { id: 'applicants' as Tab, svgPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', labelKey: 'EMPLOYER.NAV.APPLICANTS', badge: '12' },
  ];

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

  recentApplicants: Array<{ avatar: string; name: string; title: string; job: string; status: ApplicantStatus }> = [];

  readonly homeHeroStats = computed(() => [
    { value: this.postedJobs.length, labelKey: 'EMPLOYER.HOME.HERO_STATS.TOTAL_POSTS' },
    { value: this.activeJobsCount(), labelKey: 'EMPLOYER.HOME.HERO_STATS.ACTIVE_JOBS' },
    { value: this.totalApplicants(), labelKey: 'EMPLOYER.HOME.HERO_STATS.TOTAL_APPLICANTS' },
  ]);

  readonly homeQuickActions = computed<EmployerQuickAction[]>(() => [
    {
      route: '/employer/post-job',
      titleKey: 'EMPLOYER.HOME.ACTIONS.POST_JOB.TITLE',
      subtitleKey: 'EMPLOYER.HOME.ACTIONS.POST_JOB.SUBTITLE',
      count: null,
      accentClass: 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700',
      iconPath: 'M12 4v16m8-8H4',
    },
    {
      route: '/employer/manage-jobs',
      titleKey: 'EMPLOYER.HOME.ACTIONS.MANAGE_JOBS.TITLE',
      subtitleKey: 'EMPLOYER.HOME.ACTIONS.MANAGE_JOBS.SUBTITLE',
      count: this.activeJobsCount(),
      accentClass: 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700',
      iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      route: '/employer/candidates',
      titleKey: 'EMPLOYER.HOME.ACTIONS.VIEW_APPLICANTS.TITLE',
      subtitleKey: 'EMPLOYER.HOME.ACTIONS.VIEW_APPLICANTS.SUBTITLE',
      count: this.totalApplicants(),
      accentClass: 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700',
      iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    },
  ]);

  readonly pipelineStats = computed(() => [
    { labelKey: 'EMPLOYER.STATUS.NEW', value: this.recentApplicants.filter(applicant => applicant.status === 'new').length, accentClass: 'bg-blue-50 text-blue-700 ring-blue-200' },
    { labelKey: 'EMPLOYER.STATUS.REVIEWED', value: this.recentApplicants.filter(applicant => applicant.status === 'reviewed').length, accentClass: 'bg-slate-100 text-slate-700 ring-slate-200' },
    { labelKey: 'EMPLOYER.STATUS.SHORTLISTED', value: this.recentApplicants.filter(applicant => applicant.status === 'shortlisted').length, accentClass: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  ]);

  readonly performanceCards = computed(() => [
    { value: this.stats[0].value, labelKey: this.stats[0].labelKey, toneClass: 'from-blue-100 to-cyan-100 text-blue-700' },
    { value: this.stats[1].value, labelKey: this.stats[1].labelKey, toneClass: 'from-emerald-100 to-teal-100 text-emerald-700' },
    { value: this.stats[2].value, labelKey: this.stats[2].labelKey, toneClass: 'from-amber-100 to-orange-100 text-amber-700' },
    { value: this.stats[3].value, labelKey: this.stats[3].labelKey, toneClass: 'from-fuchsia-100 to-pink-100 text-fuchsia-700' },
  ]);

  jobForm = this.fb.group({
    companyId: ['', Validators.required],
    title: ['', Validators.required],
    jobCategoryId: ['', Validators.required],
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

    this.loadCompanies();
    this.loadJobCategories();
    this.loadEmployerApplications();
  }

  onPostJob(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const salary = this.parseSalaryRange(this.jobForm.value.salary ?? '');
    const skills = (this.jobForm.value.skills ?? '')
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    const payload: CreateJobPayload = {
      companyId: this.jobForm.value.companyId ?? '',
      jobCategoryId: this.jobForm.value.jobCategoryId ?? '',
      title: this.jobForm.value.title ?? '',
      description: this.jobForm.value.description ?? '',
      location: this.jobForm.value.location ?? '',
      isRemote: (this.jobForm.value.type ?? '') === 'remote',
      minSalary: salary.minSalary,
      maxSalary: salary.maxSalary,
      employmentType: this.toEmploymentType(this.jobForm.value.type ?? ''),
      experienceLevel: this.jobForm.value.experienceLevel ?? null,
      deadlineUtc: null,
      skills,
      requirements: [],
    };

    this.postJobError.set(null);
    this.jobPosting.set(true);
    this.jobsService.createJob(payload).subscribe({
      next: () => {
        this.jobPosting.set(false);
        this.postedJobs.unshift({
          title: payload.title,
          type: this.normalizePostedType(payload.employmentType ?? ''),
          applicants: 0,
          views: 0,
          postedKey: 'COMMON.TIME.TODAY',
          active: true,
        });
        this.toastService.success(this.translate.instant('EMPLOYER.TOASTS.JOB_POSTED'));
        this.jobForm.reset();
        this.activeTab.set('jobs');
      },
      error: (error) => {
        this.jobPosting.set(false);
        this.handleError(error);
      },
    });
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

  companyDisplayName(): string {
    return this.auth.currentUser()?.company || this.translate.instant('EMPLOYER.COMPANY_PROFILE.EMPTY_COMPANY');
  }

  ownerDisplayName(): string {
    return this.auth.currentUser()?.name || this.translate.instant('EMPLOYER.COMPANY_PROFILE.EMPTY_OWNER');
  }

  totalApplicants(): number {
    return this.postedJobs.reduce((sum, job) => sum + job.applicants, 0);
  }

  activeJobsCount(): number {
    return this.postedJobs.filter(job => job.active).length;
  }

  hiringHealthPercent(): number {
    const applicants = this.totalApplicants();
    if (!applicants) {
      return 0;
    }

    const shortlisted = this.recentApplicants.filter(applicant => applicant.status === 'shortlisted').length;
    return Math.round((shortlisted / applicants) * 100);
  }

  translateJobTitle(title: string): string {
    const titleMap: Record<string, string> = {
      'Senior Frontend Developer': 'JOBS.CARD.TITLES.SENIOR_FRONTEND_DEVELOPER',
      'Product Designer': 'EMPLOYER.HOME.JOB_TITLES.PRODUCT_DESIGNER',
      'Backend Engineer': 'EMPLOYER.HOME.JOB_TITLES.BACKEND_ENGINEER',
      'Data Analyst': 'FREELANCERS.CARD.ROLES.DATA_ANALYST',
      'DevOps Engineer': 'JOBS.CARD.TITLES.DEVOPS_ENGINEER',
    };

    const key = titleMap[title];
    return key ? this.translate.instant(key) : title;
  }

  isArabic(): boolean {
    return this.languageService.currentLanguage() === 'ar';
  }

  private loadCompanies(): void {
    this.companiesLoading.set(true);
    this.companiesService.getMyCompany().subscribe({
      next: (company) => {
        this.companies.set([company]);
        this.jobForm.patchValue({ companyId: company.id });
        this.companiesLoading.set(false);
      },
      error: (error) => {
        this.companies.set([]);
        this.companiesLoading.set(false);
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return;
        }
        this.handleError(error);
      },
    });
  }

  private loadJobCategories(): void {
    this.categoriesLoading.set(true);
    this.apiService.get<JobCategoryOption[]>('jobcategories').subscribe({
      next: (categories) => {
        this.jobCategories.set(categories);
        this.categoriesLoading.set(false);
      },
      error: (error) => {
        this.jobCategories.set([]);
        this.categoriesLoading.set(false);
        this.handleError(error);
      },
    });
  }

  private loadEmployerApplications(): void {
    this.applicationsService.getEmployerApplications().subscribe({
      next: (applications) => {
        this.recentApplicants = applications.slice(0, 12).map((application) => this.mapApplicationToApplicant(application));
      },
      error: () => {
        this.recentApplicants = [];
      },
    });
  }

  private toEmploymentType(value: string): string {
    const normalized = value.toLowerCase();
    if (normalized === 'full-time') return 'FullTime';
    if (normalized === 'part-time') return 'PartTime';
    if (normalized === 'contract') return 'Contract';
    if (normalized === 'remote') return 'Remote';
    if (normalized === 'internship') return 'Internship';
    return 'FullTime';
  }

  private normalizePostedType(value: string): PostedJob['type'] {
    const normalized = value.toLowerCase();
    if (normalized === 'contract') return 'contract';
    if (normalized === 'remote') return 'remote';
    return 'full-time';
  }

  private parseSalaryRange(input: string): { minSalary: number | null; maxSalary: number | null } {
    const numbers = (input.match(/[\d,.]+/g) ?? [])
      .map((token) => Number(token.replace(/,/g, '')))
      .filter((value) => Number.isFinite(value));

    if (numbers.length === 0) {
      return { minSalary: null, maxSalary: null };
    }

    if (numbers.length === 1) {
      return { minSalary: numbers[0], maxSalary: null };
    }

    return { minSalary: Math.min(numbers[0], numbers[1]), maxSalary: Math.max(numbers[0], numbers[1]) };
  }

  private mapApplicationToApplicant(application: JobApplicationDto): { avatar: string; name: string; title: string; job: string; status: ApplicantStatus } {
    const shortId = application.candidateUserId.slice(0, 8).toUpperCase();
    const name = `Candidate ${shortId}`;
    const status = this.toApplicantStatus(application.status);
    return {
      avatar: shortId.slice(0, 2),
      name,
      title: 'Candidate',
      job: `Job ${application.jobId.slice(0, 8)}`,
      status,
    };
  }

  private toApplicantStatus(status: string): ApplicantStatus {
    const normalized = status.toLowerCase();
    if (normalized === 'reviewing') {
      return 'reviewed';
    }
    if (normalized === 'shortlisted' || normalized === 'hired') {
      return 'shortlisted';
    }
    return 'new';
  }

  private handleError(error: unknown): void {
    const message = error instanceof HttpErrorResponse
      ? (error.error?.message || error.error?.error || error.message || this.translate.instant('AUTH.LOGIN.ERROR_TOAST'))
      : this.translate.instant('AUTH.LOGIN.ERROR_TOAST');
    this.postJobError.set(message);
    this.toastService.error(message);
  }
}
