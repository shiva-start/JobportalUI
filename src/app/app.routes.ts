import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/jobs-list/jobs-list.component').then(m => m.JobsListComponent)
  },
  {
    path: 'freelancers',
    loadComponent: () => import('./features/freelancers/freelancers.component').then(m => m.FreelancersComponent)
  },
  {
    path: 'companies',
    loadComponent: () => import('./features/companies/companies.component').then(m => m.CompaniesComponent)
  },
  {
    path: 'jobs/:id',
    loadComponent: () => import('./features/jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'freelancer-request',
    loadComponent: () => import('./features/freelancer-request/freelancer-request.component').then(m => m.FreelancerRequestComponent)
  },
  // ---- Public Content Pages ----
  {
    path: 'blog',
    loadComponent: () => import('./features/public/blog/pages/blog-list-page.component').then(m => m.BlogListPageComponent)
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./features/public/blog/pages/blog-detail-page.component').then(m => m.BlogDetailPageComponent)
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/public/courses/pages/courses-list-page.component').then(m => m.CoursesListPageComponent)
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./features/public/courses/pages/course-detail-page.component').then(m => m.CourseDetailPageComponent)
  },
  {
    path: 'internships',
    loadComponent: () => import('./features/public/internships/pages/internships-list-page.component').then(m => m.InternshipsListPageComponent)
  },
  {
    path: 'internships/:id',
    loadComponent: () => import('./features/public/internships/pages/internship-detail-page.component').then(m => m.InternshipDetailPageComponent)
  },
  {
    path: 'help',
    loadComponent: () => import('./features/public/help/pages/help-page.component').then(m => m.HelpPageComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-shell.component').then(m => m.AdminShellComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/pages/admin-dashboard-page.component').then(m => m.AdminDashboardPageComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/pages/admin-users-page.component').then(m => m.AdminUsersPageComponent),
      },
      {
        path: 'jobs',
        loadComponent: () => import('./features/admin/pages/admin-jobs-page.component').then(m => m.AdminJobsPageComponent),
      },
      {
        path: 'requests',
        loadComponent: () => import('./features/admin/pages/admin-requests-page.component').then(m => m.AdminRequestsPageComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/pages/admin-reports-page.component').then(m => m.AdminReportsPageComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/pages/admin-settings-page.component').then(m => m.AdminSettingsPageComponent),
      },
    ]
  },
  {
    path: 'candidate',
    loadComponent: () => import('./features/candidate/candidate-shell.component').then(m => m.CandidateShellComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'candidate' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/candidate/pages/candidate-overview-page.component').then(m => m.CandidateOverviewPageComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/candidate/pages/candidate-profile-page.component').then(m => m.CandidateProfilePageComponent),
      },
      {
        path: 'jobs',
        loadComponent: () => import('./features/candidate/pages/candidate-jobs-page.component').then(m => m.CandidateJobsPageComponent),
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/candidate/pages/candidate-applications-page.component').then(m => m.CandidateApplicationsPageComponent),
      },
      {
        path: 'saved-jobs',
        loadComponent: () => import('./features/candidate/pages/candidate-saved-jobs-page.component').then(m => m.CandidateSavedJobsPageComponent),
      },
      {
        path: 'messages',
        loadComponent: () => import('./features/candidate/pages/candidate-messages-page.component').then(m => m.CandidateMessagesPageComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/candidate/pages/candidate-notifications-page.component').then(m => m.CandidateNotificationsPageComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/candidate/pages/candidate-settings-page.component').then(m => m.CandidateSettingsPageComponent),
      },
    ]
  },
  {
    path: 'employer',
    loadComponent: () => import('./features/employer/employer-dashboard.component').then(m => m.EmployerDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer' }
  },
  {
    path: 'employer/dashboard',
    loadComponent: () => import('./features/employer/employer-dashboard.component').then(m => m.EmployerDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer', tab: 'overview' }
  },
  {
    path: 'employer/post-job',
    loadComponent: () => import('./features/employer/employer-dashboard.component').then(m => m.EmployerDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer', tab: 'post-job' }
  },
  {
    path: 'employer/manage-jobs',
    loadComponent: () => import('./features/employer/employer-dashboard.component').then(m => m.EmployerDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer', tab: 'jobs' }
  },
  {
    path: 'employer/candidates',
    loadComponent: () => import('./features/employer/employer-dashboard.component').then(m => m.EmployerDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer', tab: 'applicants' }
  },
  {
    path: 'employer/messages',
    loadComponent: () => import('./features/employer/employer-messages.component').then(m => m.EmployerMessagesComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer' }
  },
  {
    path: 'employer/company-profile',
    loadComponent: () => import('./features/employer/employer-company-profile.component').then(m => m.EmployerCompanyProfileComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer' }
  },
  {
    path: 'employer/settings',
    loadComponent: () => import('./features/employer/employer-settings.component').then(m => m.EmployerSettingsComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'employer' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
