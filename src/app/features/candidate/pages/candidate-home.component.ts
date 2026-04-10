import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';
import { JobService } from '../../../core/services/job.service';
import { LanguageService } from '../../../core/services/language.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';

@Component({
  selector: 'app-candidate-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, JobCardComponent],
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
                {{ 'CANDIDATE.HOME.WELCOME_LABEL' | translate }}
              </div>

              <div class="space-y-3">
                <h1 class="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.7rem] rtl:text-right">
                  {{ 'CANDIDATE.HOME.WELCOME_TITLE' | translate:{ name: displayName() } }}
                </h1>
                <p class="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base rtl:text-right">
                  {{ heroSubtitle() }}
                </p>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
              @for (stat of heroStats(); track stat.label) {
                <div class="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm">
                  <p class="text-2xl font-semibold text-white">{{ stat.value }}</p>
                  <p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300 rtl:text-right">{{ stat.label }}</p>
                </div>
              }
            </div>

            <div class="flex flex-wrap gap-3 rtl:flex-row-reverse">
              <a
                routerLink="/candidate/jobs"
                class="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                {{ 'CANDIDATE.HOME.BROWSE_JOBS' | translate }}
              </a>
              <a
                routerLink="/candidate/profile"
                class="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                {{ candidate.profileCompletion() < 100 ? ('CANDIDATE.HOME.COMPLETE_PROFILE' | translate) : ('CANDIDATE.HOME.IMPROVE_PROFILE' | translate) }}
              </a>
              <a
                routerLink="/candidate/applications"
                class="inline-flex items-center justify-center rounded-xl border border-transparent px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:text-white"
              >
                {{ 'CANDIDATE.OVERVIEW.APPLICATIONS_LINK' | translate }}
              </a>
            </div>
          </div>

          <div class="grid gap-4 self-start">
            <div class="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div class="flex items-start justify-between gap-4 rtl:flex-row-reverse">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300 rtl:text-right">
                    {{ 'CANDIDATE.HOME.PROFILE_STRENGTH' | translate }}
                  </p>
                  <p class="mt-2 text-4xl font-semibold text-white">{{ candidate.profileCompletion() }}%</p>
                </div>
                <div class="rounded-2xl bg-emerald-400/15 px-3 py-2 text-sm font-semibold text-emerald-200">
                  {{ profileStrengthTone() }}
                </div>
              </div>

              <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div class="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" [style.width.%]="candidate.profileCompletion()"></div>
              </div>

              <p class="mt-4 text-sm leading-6 text-slate-200 rtl:text-right">
                {{ profileStrengthMessageKey() | translate }}
              </p>

              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                @for (item of profileHighlights(); track item.label) {
                  <div class="rounded-2xl bg-slate-900/40 px-4 py-3">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400 rtl:text-right">{{ item.label }}</p>
                    <p class="mt-1 text-sm font-semibold text-white rtl:text-right">{{ item.value }}</p>
                  </div>
                }
              </div>
            </div>

            <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div class="flex items-center justify-between gap-3 rtl:flex-row-reverse">
                <div>
                  <p class="text-sm font-semibold text-white rtl:text-right">Priority next steps</p>
                  <p class="mt-1 text-sm text-slate-300 rtl:text-right">Small actions that improve your visibility this week.</p>
                </div>
                <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">{{ priorityActions().length }}</span>
              </div>

              <div class="mt-4 space-y-3">
                @for (action of priorityActions(); track action.title) {
                  <a
                    [routerLink]="action.route"
                    class="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/35 px-4 py-3 transition hover:bg-slate-900/55 rtl:flex-row-reverse"
                  >
                    <div>
                      <p class="text-sm font-semibold text-white rtl:text-right">{{ action.title }}</p>
                      <p class="mt-1 text-sm text-slate-300 rtl:text-right">{{ action.description }}</p>
                    </div>
                    <span class="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">{{ action.badge }}</span>
                  </a>
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
            <h2 class="mt-4 text-base font-semibold text-slate-900 rtl:text-right">{{ action.titleKey | translate }}</h2>
            <p class="mt-1 text-sm leading-6 text-slate-500 rtl:text-right">{{ action.subtitleKey | translate }}</p>
          </a>
        }
      </div>

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
        <div class="space-y-6">
          <div class="overflow-hidden rounded-[1.8rem] border border-slate-200/70 bg-white shadow-[0_20px_45px_-35px_rgba(15,23,42,0.3)]">
            <div class="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between rtl:sm:flex-row-reverse">
              <div>
                <h2 class="text-xl font-semibold text-slate-900 rtl:text-right">{{ 'CANDIDATE.HOME.RECOMMENDED_TITLE' | translate }}</h2>
                <p class="mt-1 text-sm text-slate-500 rtl:text-right">{{ 'CANDIDATE.HOME.RECOMMENDED_SUBTITLE' | translate }}</p>
              </div>
              <a routerLink="/candidate/jobs" class="text-sm font-semibold text-blue-600 hover:text-blue-700">
                {{ 'CANDIDATE.OVERVIEW.SEE_ALL' | translate }}
              </a>
            </div>

            @if (candidate.recommendedJobs().length) {
              <div class="grid gap-4 p-5 md:grid-cols-2">
                @for (job of candidate.recommendedJobs().slice(0, 4); track job.id) {
                  <app-job-card [job]="job" [saved]="jobService.isJobSaved(job.id)" (saveToggle)="toggleSave($event)"></app-job-card>
                }
              </div>
            } @else {
              <p class="px-5 py-8 text-sm text-slate-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
            }
          </div>

          <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(290px,0.92fr)]">
            <div class="rounded-[1.8rem] border border-slate-200/70 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.25)]">
              <div class="mb-4 flex items-center justify-between gap-3 rtl:flex-row-reverse">
                <div>
                  <h2 class="text-lg font-semibold text-slate-900 rtl:text-right">{{ 'CANDIDATE.HOME.RECENT_ACTIVITY' | translate }}</h2>
                  <p class="mt-1 text-sm text-slate-500 rtl:text-right">{{ 'CANDIDATE.HOME.RECENT_ACTIVITY_SUBTITLE' | translate }}</p>
                </div>
                <a routerLink="/candidate/applications" class="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  {{ 'CANDIDATE.OVERVIEW.APPLICATIONS_LINK' | translate }}
                </a>
              </div>

              @if (candidate.recentActivity().length) {
                <div class="space-y-3">
                  @for (item of candidate.recentActivity().slice(0, 4); track item.id) {
                    <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                      <p class="text-sm font-semibold text-slate-900 rtl:text-right">{{ item.title }}</p>
                      <p class="mt-1 text-sm leading-6 text-slate-500 rtl:text-right">{{ item.description }}</p>
                      <p class="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 rtl:text-right">{{ $any(item).dateLabel || (item.date | date:'mediumDate') }}</p>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-sm text-slate-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
              }
            </div>

            <div class="rounded-[1.8rem] border border-amber-200/70 bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)] p-5 shadow-[0_20px_45px_-35px_rgba(180,83,9,0.28)]">
              <div class="flex items-center justify-between gap-3 rtl:flex-row-reverse">
                <div>
                  <h2 class="text-lg font-semibold text-slate-900 rtl:text-right">Career accelerator</h2>
                  <p class="mt-1 text-sm text-slate-500 rtl:text-right">Keep your profile discoverable and application-ready.</p>
                </div>
                <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{{ completedChecklistCount() }}/{{ candidate.profileChecklist().length }}</span>
              </div>

              <div class="mt-4 space-y-3">
                @for (item of candidate.profileChecklist(); track item.labelKey) {
                  <a
                    [routerLink]="item.route"
                    class="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition rtl:flex-row-reverse"
                    [class.border-emerald-200]="item.done"
                    [class.bg-emerald-50]="item.done"
                    [class.border-slate-200]="!item.done"
                    [class.bg-white]="!item.done"
                  >
                    <div class="flex items-center gap-3 rtl:flex-row-reverse">
                      <span
                        class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                        [class.bg-emerald-500]="item.done"
                        [class.text-white]="item.done"
                        [class.bg-slate-100]="!item.done"
                        [class.text-slate-500]="!item.done"
                      >
                        {{ item.done ? 'OK' : '+' }}
                      </span>
                      <span class="text-sm font-medium text-slate-700 rtl:text-right">{{ item.labelKey | translate }}</span>
                    </div>
                    <span class="text-xs font-semibold uppercase tracking-[0.16em]" [class.text-emerald-600]="item.done" [class.text-slate-400]="!item.done">
                      {{ item.done ? 'Done' : 'Next' }}
                    </span>
                  </a>
                }
              </div>

              <a
                routerLink="/candidate/profile"
                class="mt-5 inline-flex items-center text-sm font-semibold text-amber-700 transition hover:text-amber-800"
              >
                {{ 'CANDIDATE.HOME.IMPROVE_PROFILE' | translate }}
              </a>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-[1.8rem] border border-slate-200/70 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.25)]">
            <div class="mb-4 flex items-center justify-between gap-3 rtl:flex-row-reverse">
              <div>
                <h2 class="text-lg font-semibold text-slate-900 rtl:text-right">Inbox highlights</h2>
                <p class="mt-1 text-sm text-slate-500 rtl:text-right">Recruiter and platform updates that need attention.</p>
              </div>
              <a routerLink="/candidate/messages" class="text-sm font-semibold text-blue-600 hover:text-blue-700">
                View all
              </a>
            </div>

            <div class="space-y-3">
              @for (message of candidate.localizedMessages().slice(0, 2); track message.id) {
                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div class="flex items-center justify-between gap-3 rtl:flex-row-reverse">
                    <div>
                      <p class="text-sm font-semibold text-slate-900 rtl:text-right">{{ message.from }}</p>
                      <p class="text-xs uppercase tracking-[0.18em] text-slate-400 rtl:text-right">{{ message.company }}</p>
                    </div>
                    @if (!message.read) {
                      <span class="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">New</span>
                    }
                  </div>
                  <p class="mt-3 text-sm font-medium text-slate-800 rtl:text-right">{{ message.subject }}</p>
                  <p class="mt-1 text-sm leading-6 text-slate-500 rtl:text-right">{{ message.preview }}</p>
                  <p class="mt-2 text-xs text-slate-400 rtl:text-right">{{ $any(message).dateLabel || (message.date | date:'mediumDate') }}</p>
                </div>
              }
            </div>
          </div>

          <div class="rounded-[1.8rem] border border-slate-200/70 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.25)]">
            <div class="mb-4 flex items-center justify-between gap-3 rtl:flex-row-reverse">
              <div>
                <h2 class="text-lg font-semibold text-slate-900 rtl:text-right">Opportunity signals</h2>
                <p class="mt-1 text-sm text-slate-500 rtl:text-right">Live indicators from your applications and alerts.</p>
              </div>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{{ candidate.localizedNotifications().length }}</span>
            </div>

            <div class="space-y-3">
              @for (notification of candidate.localizedNotifications().slice(0, 3); track notification.id) {
                <a
                  [routerLink]="notification.actionRoute || '/candidate/applications'"
                  class="block rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-slate-200 hover:bg-white"
                >
                  <div class="flex items-center justify-between gap-3 rtl:flex-row-reverse">
                    <p class="text-sm font-semibold text-slate-900 rtl:text-right">{{ notification.title }}</p>
                    @if (!notification.read) {
                      <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
                    }
                  </div>
                  <p class="mt-2 text-sm leading-6 text-slate-500 rtl:text-right">{{ notification.message }}</p>
                  <div class="mt-3 flex items-center justify-between gap-3 rtl:flex-row-reverse">
                    <span class="text-xs text-slate-400">{{ $any(notification).dateLabel || (notification.date | date:'mediumDate') }}</span>
                    @if (notification.actionLabel) {
                      <span class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">{{ notification.actionLabel }}</span>
                    }
                  </div>
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CandidateHomeComponent {
  private readonly userNameKeys: Record<string, string> = {
    'Ahmed Hassan': 'CANDIDATE.USER.NAME.AHMED_HASSAN',
  };

  readonly auth = inject(AuthService);
  readonly candidate = inject(CandidateDashboardService);
  readonly jobService = inject(JobService);
  readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  readonly displayName = computed(() => {
    this.languageService.currentLanguage();

    const currentUserName = this.auth.currentUser()?.name;
    if (!currentUserName) {
      return 'Candidate';
    }

    const key = this.userNameKeys[currentUserName];
    if (!key) {
      return currentUserName;
    }

    return this.translate.instant(key);
  });

  readonly quickActions = computed(() => [
    {
      route: '/candidate/jobs',
      titleKey: 'CANDIDATE.HOME.ACTIONS.BROWSE_JOBS.TITLE',
      subtitleKey: 'CANDIDATE.HOME.ACTIONS.BROWSE_JOBS.SUBTITLE',
      count: this.candidate.recommendedJobs().length,
      accentClass: 'bg-gradient-to-br from-blue-100 to-blue-200',
      iconPath: 'M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z',
    },
    {
      route: '/candidate/applications',
      titleKey: 'CANDIDATE.HOME.ACTIONS.APPLICATIONS.TITLE',
      subtitleKey: 'CANDIDATE.HOME.ACTIONS.APPLICATIONS.SUBTITLE',
      count: this.jobService.getAppliedJobs().length,
      accentClass: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
      iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0117 7.414V19a2 2 0 01-2 2z',
    },
    {
      route: '/candidate/profile',
      titleKey: 'CANDIDATE.HOME.ACTIONS.PROFILE.TITLE',
      subtitleKey: 'CANDIDATE.HOME.ACTIONS.PROFILE.SUBTITLE',
      count: this.candidate.profileCompletion(),
      accentClass: 'bg-gradient-to-br from-amber-100 to-orange-200',
      iconPath: 'M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      route: '/candidate/saved-jobs',
      titleKey: 'CANDIDATE.HOME.ACTIONS.SAVED.TITLE',
      subtitleKey: 'CANDIDATE.HOME.ACTIONS.SAVED.SUBTITLE',
      count: this.jobService.getSavedJobs().length,
      accentClass: 'bg-gradient-to-br from-fuchsia-100 to-pink-200',
      iconPath: 'M5 5.5A2.5 2.5 0 017.5 3h9A2.5 2.5 0 0119 5.5v15l-7-4-7 4v-15z',
    },
  ]);

  readonly heroStats = computed(() => {
    const applicationStats = this.candidate.dashboardStats();
    return [
      {
        value: this.candidate.recommendedJobs().length,
        label: this.translate.instant('CANDIDATE.HOME.RECOMMENDED_TITLE'),
      },
      {
        value: applicationStats[0]?.value ?? 0,
        label: this.translate.instant('CANDIDATE.OVERVIEW.STATS.TOTAL_APPLICATIONS'),
      },
      {
        value: this.candidate.unreadMessageCount() + this.candidate.unreadNotificationCount(),
        label: 'Unread updates',
      },
    ];
  });

  readonly profileHighlights = computed(() => {
    const profile = this.candidate.profile();
    return [
      {
        label: 'Headline',
        value: profile.headline || 'Add your headline',
      },
      {
        label: 'Location',
        value: profile.location || 'Add your location',
      },
      {
        label: 'Skills',
        value: `${profile.skills.length} listed`,
      },
      {
        label: 'Resume',
        value: profile.resume?.name || 'Upload resume',
      },
    ];
  });

  readonly priorityActions = computed(() => {
    const checklist = this.candidate.profileChecklist();
    const pendingChecklist = checklist.filter(item => !item.done).slice(0, 2).map(item => ({
      route: item.route,
      title: this.translate.instant(item.labelKey),
      description: 'Complete this profile step to improve discoverability.',
      badge: 'Profile',
    }));

    const updates = this.candidate.localizedNotifications()
      .filter(notification => !notification.read)
      .slice(0, 2)
      .map(notification => ({
        route: notification.actionRoute || '/candidate/applications',
        title: notification.title,
        description: notification.message,
        badge: notification.category === 'message' ? 'Inbox' : 'Alert',
      }));

    return [...pendingChecklist, ...updates].slice(0, 3);
  });

  readonly completedChecklistCount = computed(() =>
    this.candidate.profileChecklist().filter(item => item.done).length,
  );

  toggleSave(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
  }

  isArabic(): boolean {
    return this.languageService.currentLanguage() === 'ar';
  }

  profileStrengthMessageKey(): string {
    const completion = this.candidate.profileCompletion();

    if (completion >= 80) {
      return 'CANDIDATE.HOME.PROFILE_STRENGTH_MESSAGES.STRONG';
    }

    if (completion >= 50) {
      return 'CANDIDATE.HOME.PROFILE_STRENGTH_MESSAGES.GROWING';
    }

    return 'CANDIDATE.HOME.PROFILE_STRENGTH_MESSAGES.START';
  }

  heroSubtitle(): string {
    const profile = this.candidate.profile();
    const unreadUpdates = this.candidate.unreadMessageCount() + this.candidate.unreadNotificationCount();

    return profile.about
      ? `${profile.about} You have ${unreadUpdates} active update${unreadUpdates === 1 ? '' : 's'} and ${this.candidate.recommendedJobs().length} recommended role${this.candidate.recommendedJobs().length === 1 ? '' : 's'} waiting.`
      : this.translate.instant('CANDIDATE.HOME.WELCOME_SUBTITLE');
  }

  profileStrengthTone(): string {
    const completion = this.candidate.profileCompletion();

    if (completion >= 80) {
      return 'Strong';
    }

    if (completion >= 50) {
      return 'Growing';
    }

    return 'Starter';
  }
}
