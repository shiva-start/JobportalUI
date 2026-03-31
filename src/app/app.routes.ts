import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
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
    path: 'candidate',
    loadComponent: () => import('./features/candidate/candidate-dashboard.component').then(m => m.CandidateDashboardComponent)
  },
  {
    path: 'employer',
    loadComponent: () => import('./features/employer/employer-dashboard.component').then(m => m.EmployerDashboardComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
