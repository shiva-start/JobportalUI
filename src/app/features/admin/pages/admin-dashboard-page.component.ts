import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <section [attr.dir]="isArabic() ? 'rtl' : 'ltr'" class="space-y-8 bg-slate-50/60 pb-2">
      <div class="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.85)]">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.34),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.28),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(30,41,59,0.92)_45%,_rgba(8,47,73,0.9))]"></div>
        <div class="absolute -left-16 top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div class="absolute bottom-0 right-0 h-48 w-48 translate-x-10 translate-y-12 rounded-full bg-blue-500/20 blur-3xl"></div>

        <div class="relative grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] lg:px-8 lg:py-10">
          <div class="space-y-7">
            <div class="space-y-4">
              <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 rtl:flex-row-reverse">
                <span class="h-2 w-2 rounded-full bg-emerald-300"></span>
                Admin Workspace
              </div>

              <div class="space-y-3">
                <h1 class="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.7rem] rtl:text-right">
                  Welcome to the Admin Dashboard
                </h1>
                <p class="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base rtl:text-right">
                  Manage platform operations, review platform activity, and oversee comprehensive usage trends perfectly configured for administrators.
                </p>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              @for (stat of dashboardCards(); track stat.label) {
                <div class="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
                  <p class="text-2xl font-semibold text-white">{{ stat.value }}</p>
                  <p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300 rtl:text-right">{{ stat.label }}</p>
                </div>
              }
            </div>

            <div class="flex flex-wrap gap-3 rtl:flex-row-reverse">
              <a
                routerLink="/admin/users"
                class="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Manage Users
              </a>
              <a
                routerLink="/admin/jobs"
                class="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Manage Jobs
              </a>
              <a
                routerLink="/admin/reports"
                class="inline-flex items-center justify-center rounded-xl border border-transparent px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:text-white"
              >
                View Reports
              </a>
            </div>
          </div>

          <div class="grid gap-4 self-start">
            <div class="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div class="flex items-start justify-between gap-4 rtl:flex-row-reverse">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300 rtl:text-right">
                    Platform Insights
                  </p>
                  <p class="mt-2 text-4xl font-semibold text-white">{{ admin.users().length }}</p>
                </div>
                <div class="rounded-2xl bg-blue-400/15 px-3 py-2 text-sm font-semibold text-blue-200">
                  Total Users
                </div>
              </div>

              <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div class="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400" [style.width.%]="70"></div>
              </div>

              <p class="mt-4 text-sm leading-6 text-slate-200 rtl:text-right">
                User engagement is growing steadily across regions.
              </p>

              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                @for (item of admin.analytics(); track item.label) {
                  <div class="rounded-2xl bg-slate-900/40 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400 rtl:text-right">{{ item.label }}</p>
                    <p class="mt-1 text-sm font-semibold text-white rtl:text-right">{{ item.value }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
        @for (action of quickActions(); track action.route) {
          <a
            [routerLink]="action.route"
            class="group rounded-[1.6rem] border border-slate-200/70 bg-white p-4 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_25px_50px_-30px_rgba(37,99,235,0.28)]"
          >
            <div class="flex items-start justify-between gap-3 rtl:flex-row-reverse">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-slate-700" [class]="action.accentClass">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" [attr.d]="action.iconPath" />
                </svg>
              </div>
              @if (action.count !== null) {
                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{{ action.count }}</span>
              }
            </div>
            <h2 class="mt-4 text-base font-semibold text-slate-900 rtl:text-right">{{ action.title }}</h2>
            <p class="mt-1 text-sm leading-6 text-slate-500 rtl:text-right">{{ action.subtitle }}</p>
          </a>
        }
      </div>

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
        <div class="space-y-6">
          <div class="overflow-hidden rounded-[1.8rem] border border-slate-200/70 bg-white shadow-[0_20px_45px_-35px_rgba(15,23,42,0.3)]">
            <div class="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between rtl:sm:flex-row-reverse">
              <div>
                <h2 class="text-xl font-semibold text-slate-900 rtl:text-right">Recent Activity</h2>
                <p class="mt-1 text-sm text-slate-500 rtl:text-right">Platform updates encompassing registrations, jobs, and exams.</p>
              </div>
            </div>

            @if (recentActivities().length) {
              <div class="grid gap-4 p-5 md:grid-cols-2">
                @for (activity of recentActivities().slice(0, 4); track activity.id) {
                  <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <p class="text-sm font-semibold text-slate-900 rtl:text-right">{{ activity.title }}</p>
                    <p class="mt-1 text-sm leading-6 text-slate-500 rtl:text-right">{{ activity.description }}</p>
                    <p class="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 rtl:text-right">{{ activity.date }}</p>
                  </div>
                }
              </div>
            } @else {
              <p class="px-5 py-8 text-sm text-slate-400 rtl:text-right">No recent activity detected.</p>
            }
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-[1.8rem] border border-slate-200/70 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.25)]">
            <div class="mb-4 flex items-center justify-between gap-3 rtl:flex-row-reverse">
              <div>
                <h2 class="text-lg font-semibold text-slate-900 rtl:text-right">System Alerts</h2>
                <p class="mt-1 text-sm text-slate-500 rtl:text-right">Critical platform health reports.</p>
              </div>
            </div>

            <div class="space-y-3">
              @for (report of admin.flaggedContent().slice(0, 3); track report.id) {
                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div class="flex items-center justify-between gap-3 rtl:flex-row-reverse">
                    <div>
                      <p class="text-sm font-semibold text-slate-900 rtl:text-right">{{ report.subject }}</p>
                      <p class="text-xs uppercase tracking-[0.18em] text-slate-400 rtl:text-right">{{ report.type }}</p>
                    </div>
                    <span class="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">{{ report.status }}</span>
                  </div>
                  <p class="mt-2 text-xs text-slate-400 rtl:text-right">{{ report.createdAt | date:'mediumDate' }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AdminDashboardPageComponent {
  readonly auth = inject(AuthService);
  readonly admin = inject(AdminDashboardService);
  readonly languageService = inject(LanguageService);

  readonly isArabic = computed(() => this.languageService.currentLanguage() === 'ar');

  readonly dashboardCards = computed(() => {
    return [
      { label: 'Total Users', value: this.admin.users().length.toString() },
      { label: 'Total Jobs', value: this.admin.jobsList().length.toString() },
      { label: 'Quizzes / Exams', value: '42' }, 
      { label: 'Platform Activity', value: 'High' }
    ];
  });

  readonly quickActions = computed(() => [
    {
      route: '/admin/users',
      title: 'Manage Users',
      subtitle: 'Review and manage candidates.',
      count: this.admin.users().length,
      accentClass: 'bg-gradient-to-br from-blue-100 to-blue-200',
      iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    },
    {
      route: '/admin/jobs',
      title: 'Manage Jobs',
      subtitle: 'Oversee and moderate jobs.',
      count: this.admin.jobsList().length,
      accentClass: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
      iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      route: '/admin/dashboard',
      title: 'Quizzes / Exams',
      subtitle: 'Review assessments.',
      count: 42,
      accentClass: 'bg-gradient-to-br from-amber-100 to-orange-200',
      iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    },
    {
      route: '/admin/reports',
      title: 'View Reports',
      subtitle: 'Resolve content securely.',
      count: this.admin.flaggedContent().length,
      accentClass: 'bg-gradient-to-br from-fuchsia-100 to-pink-200',
      iconPath: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
  ]);

  readonly recentActivities = computed(() => {
    return [
      { id: '1', title: 'New User Registration', description: 'Omar requested freelancer approval.', date: 'Today' },
      { id: '2', title: 'Recent Job Posting', description: 'TechCorp posted Senior Developer.', date: 'Yesterday' },
      { id: '3', title: 'Exam Activity', description: '3 candidates passed the Frontend Quiz.', date: '2 days ago' },
      { id: '4', title: 'New User Registration', description: 'Aisha created an employer account.', date: '3 days ago' },
      { id: '5', title: 'Recent Job Posting', description: 'FinEdge Corp posted Data Analyst.', date: '5 days ago' },
    ];
  });
}
