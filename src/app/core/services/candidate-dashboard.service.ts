import { formatDate } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CandidateActivity,
  CandidateNotification,
  CandidateProfile,
  RecruiterMessage,
} from '../../models';
import { AuthService } from './auth.service';
import { CandidateFreelancerRequestService } from './candidate-freelancer-request.service';
import { JobService } from './job.service';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class CandidateDashboardService {
  private readonly auth = inject(AuthService);
  private readonly jobService = inject(JobService);
  private readonly freelancerRequests = inject(CandidateFreelancerRequestService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

  private readonly messageSubjectKeys: Record<string, string> = {
    'Interview availability for Senior Frontend Developer': 'CANDIDATE.MESSAGES.SUBJECTS.INTERVIEW_AVAILABILITY',
    'Quick follow-up on your application': 'CANDIDATE.MESSAGES.SUBJECTS.QUICK_FOLLOW_UP',
    'Application update': 'CANDIDATE.MESSAGES.SUBJECTS.APPLICATION_UPDATE',
  };

  private readonly messagePreviewKeys: Record<string, string> = {
    'Your profile stood out to the team. Are you available for a first-round discussion this week?': 'CANDIDATE.MESSAGES.PREVIEWS.INTERVIEW_AVAILABILITY',
    'We are moving your application forward and would like to confirm your notice period.': 'CANDIDATE.MESSAGES.PREVIEWS.APPLICATION_FOLLOW_UP',
    'Thanks again for applying. We have filled the role but would like to keep your profile on file.': 'CANDIDATE.MESSAGES.PREVIEWS.APPLICATION_CLOSED',
  };

  private readonly notificationTitleKeys: Record<string, string> = {
    'New job match': 'CANDIDATE.NOTIFICATIONS.ITEMS.NEW_JOB_MATCH.TITLE',
    'Application moved to interview': 'CANDIDATE.NOTIFICATIONS.ITEMS.APPLICATION_MOVED.TITLE',
    'Recruiter message received': 'CANDIDATE.NOTIFICATIONS.ITEMS.RECRUITER_MESSAGE.TITLE',
    'Complete your profile': 'CANDIDATE.NOTIFICATIONS.ITEMS.COMPLETE_PROFILE.TITLE',
  };

  private readonly notificationMessageKeys: Record<string, string> = {
    '3 frontend jobs match your Angular and Tailwind skills.': 'CANDIDATE.NOTIFICATIONS.ITEMS.NEW_JOB_MATCH.MESSAGE',
    'PeopleMesh advanced your application to the interview stage.': 'CANDIDATE.NOTIFICATIONS.ITEMS.APPLICATION_MOVED.MESSAGE',
    'Neha Kapoor sent you a new message about interview scheduling.': 'CANDIDATE.NOTIFICATIONS.ITEMS.RECRUITER_MESSAGE.MESSAGE',
    'Adding one more project or certification can improve recruiter visibility.': 'CANDIDATE.NOTIFICATIONS.ITEMS.COMPLETE_PROFILE.MESSAGE',
  };

  private readonly notificationActionLabelKeys: Record<string, string> = {
    'View jobs': 'CANDIDATE.NOTIFICATIONS.ITEMS.ACTIONS.VIEW_JOBS',
    'View applications': 'CANDIDATE.NOTIFICATIONS.ITEMS.ACTIONS.VIEW_APPLICATIONS',
    'Open messages': 'CANDIDATE.NOTIFICATIONS.ITEMS.ACTIONS.OPEN_MESSAGES',
    'Open profile': 'CANDIDATE.NOTIFICATIONS.ITEMS.ACTIONS.OPEN_PROFILE',
  };

  private readonly _profile = signal<CandidateProfile>({
    userId: '1',
    headline: 'Senior Frontend Developer',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    about:
      'Frontend engineer with 5+ years of experience building high-conversion product experiences for SaaS and hiring platforms. Strong in Angular, TypeScript, performance, and design systems.',
    profilePicture: '',
    skills: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS', 'Node.js', 'Figma', 'GraphQL'],
    education: [
      {
        id: 'e1',
        degree: 'B.Tech',
        institution: 'Visvesvaraya Technological University',
        field: 'Computer Science',
        startYear: 2014,
        endYear: 2018,
        grade: '8.7 CGPA',
      },
    ],
    experience: [
      {
        id: 'x1',
        title: 'Senior Frontend Developer',
        company: 'TalentForge',
        location: 'Bengaluru, India',
        startDate: 'Jan 2023',
        endDate: 'Present',
        current: true,
        description:
          'Led candidate-facing dashboard modernization, improved conversion on apply flows, and shipped reusable UI primitives across profile and messaging surfaces.',
      },
      {
        id: 'x2',
        title: 'Frontend Developer',
        company: 'BuildStack Labs',
        location: 'Remote',
        startDate: 'Jul 2018',
        endDate: 'Dec 2022',
        current: false,
        description:
          'Built responsive web apps for B2B products, with a focus on accessibility, performance, and analytics-driven product improvements.',
      },
    ],
    certifications: [
      {
        id: 'c1',
        name: 'Google UX Design Certificate',
        issuer: 'Google',
        issuedDate: 'Aug 2022',
      },
      {
        id: 'c2',
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issuedDate: 'Jan 2024',
        expiryDate: 'Jan 2027',
      },
    ],
    resume: {
      name: 'Aarav_Sharma_Resume.pdf',
      uploadedAt: '2026-03-21',
      sizeLabel: '312 KB',
    },
    visibility: true,
  });

  private readonly _messages = signal<RecruiterMessage[]>([
    {
      id: 'm1',
      from: 'Neha Kapoor',
      company: 'HireWave',
      avatar: 'NK',
      subject: 'Interview availability for Senior Frontend Developer',
      preview: 'Your profile stood out to the team. Are you available for a first-round discussion this week?',
      date: '2026-04-02',
      read: false,
    },
    {
      id: 'm2',
      from: 'Rahul Menon',
      company: 'PeopleMesh',
      avatar: 'RM',
      subject: 'Quick follow-up on your application',
      preview: 'We are moving your application forward and would like to confirm your notice period.',
      date: '2026-04-01',
      read: false,
    },
    {
      id: 'm3',
      from: 'Priya Desai',
      company: 'CloudOrbit',
      avatar: 'PD',
      subject: 'Application update',
      preview: 'Thanks again for applying. We have filled the role but would like to keep your profile on file.',
      date: '2026-03-28',
      read: true,
    },
  ]);

  private readonly _notifications = signal<CandidateNotification[]>([
    {
      id: 'n1',
      title: 'New job match',
      message: '3 frontend jobs match your Angular and Tailwind skills.',
      date: '2026-04-03',
      read: false,
      category: 'job-alert',
      actionLabel: 'View jobs',
      actionRoute: '/candidate/jobs',
    },
    {
      id: 'n2',
      title: 'Application moved to interview',
      message: 'PeopleMesh advanced your application to the interview stage.',
      date: '2026-04-02',
      read: false,
      category: 'application-update',
      actionLabel: 'View applications',
      actionRoute: '/candidate/applications',
    },
    {
      id: 'n3',
      title: 'Recruiter message received',
      message: 'Neha Kapoor sent you a new message about interview scheduling.',
      date: '2026-04-02',
      read: true,
      category: 'message',
      actionLabel: 'Open messages',
      actionRoute: '/candidate/messages',
    },
    {
      id: 'n4',
      title: 'Complete your profile',
      message: 'Adding one more project or certification can improve recruiter visibility.',
      date: '2026-03-31',
      read: true,
      category: 'profile',
      actionLabel: 'Open profile',
      actionRoute: '/candidate/profile',
    },
  ]);

  readonly profile = computed(() => {
    const user = this.auth.currentUser();
    const profile = this._profile();
    return {
      ...profile,
      userId: user?.id ?? profile.userId,
      headline: user?.title ?? profile.headline,
      location: user?.location ?? profile.location,
      about: user?.bio ?? profile.about,
    };
  });

  readonly messages = computed(() => this._messages());
  readonly notifications = computed(() => this._notifications());
  readonly unreadMessageCount = computed(() => this._messages().filter(message => !message.read).length);
  readonly unreadNotificationCount = computed(() => this._notifications().filter(notification => !notification.read).length);
  readonly localizedMessages = computed(() => {
    const language = this.languageService.currentLanguage();

    return this._messages().map(message => ({
      ...message,
      from: message.from,
      company: message.company,
      subject: this.translateValue(message.subject, this.messageSubjectKeys, {
        jobTitle: this.translateJobTitle('Senior Frontend Developer'),
      }),
      preview: this.translateValue(message.preview, this.messagePreviewKeys),
      dateLabel: this.formatDisplayDate(message.date, language),
    }));
  });

  readonly localizedNotifications = computed(() => {
    const language = this.languageService.currentLanguage();

    return this._notifications().map(notification => ({
      ...notification,
      title: this.translateValue(notification.title, this.notificationTitleKeys),
      message: this.translateValue(notification.message, this.notificationMessageKeys, {
        sender: 'Neha Kapoor',
      }),
      actionLabel: notification.actionLabel
        ? this.translateValue(notification.actionLabel, this.notificationActionLabelKeys)
        : undefined,
      dateLabel: this.formatDisplayDate(notification.date, language),
    }));
  });

  readonly recommendedJobs = computed(() =>
    this.jobService.filteredJobs()
      .filter(job => !this.jobService.isJobApplied(job.id))
      .slice(0, 6),
  );

  readonly dashboardStats = computed(() => {
    const details = this.jobService.getApplicationDetails();
    return [
      { labelKey: 'CANDIDATE.OVERVIEW.STATS.TOTAL_APPLICATIONS', value: details.length, tone: 'blue' },
      {
        labelKey: 'CANDIDATE.OVERVIEW.STATS.SHORTLISTED',
        value: details.filter(detail => detail.status === 'shortlisted').length,
        tone: 'green',
      },
      {
        labelKey: 'CANDIDATE.OVERVIEW.STATS.INTERVIEWS',
        value: details.filter(detail => detail.status === 'interview-scheduled').length,
        tone: 'amber',
      },
    ];
  });

  readonly recentActivity = computed<CandidateActivity[]>(() => {
    const language = this.languageService.currentLanguage();
    const applicationActivity = this.jobService.getApplicationDetails().slice(0, 3).map(detail => {
      const job = this.jobService.getJobById(detail.jobId);
      const translatedJobTitle = this.translateJobTitle(job?.title);
      const translatedCompany = job?.company ?? this.translate.instant('CANDIDATE.ACTIVITY.EMPLOYER_FALLBACK');
      return {
        id: `a-${detail.jobId}`,
        title: this.translateKeyOrFallback(
          'CANDIDATE.ACTIVITY.APPLICATION_UPDATE_TITLE',
          'Application update',
          {
            jobTitle: translatedJobTitle || this.translateKeyOrFallback('CANDIDATE.ACTIVITY.ROLE_FALLBACK', 'this role'),
          },
        ),
        description: this.translateKeyOrFallback(
          'CANDIDATE.ACTIVITY.APPLICATION_UPDATE_DESCRIPTION',
          `Your application is now ${this.translateApplicationStatus(detail.status)} at ${translatedCompany}.`,
          {
            status: this.translateApplicationStatus(detail.status),
            company: translatedCompany,
          },
        ),
        date: detail.appliedAt,
        dateLabel: this.formatDisplayDate(detail.appliedAt, language),
      };
    });

    const messageActivity = this.localizedMessages().slice(0, 2).map(message => ({
      id: `m-${message.id}`,
      title: this.translateKeyOrFallback(
        'CANDIDATE.ACTIVITY.MESSAGE_FROM',
        `Message from ${message.from}`,
        { sender: message.from },
      ),
      description: message.subject,
      date: message.date,
      dateLabel: message.dateLabel,
    }));

    return [...applicationActivity, ...messageActivity]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });

  readonly profileCompletion = computed(() => {
    const profile = this.profile();
    const checks = [
      !!this.auth.currentUser()?.name,
      !!this.auth.currentUser()?.email,
      !!profile.phone,
      !!profile.location,
      !!profile.about,
      profile.skills.length > 0,
      profile.education.length > 0,
      profile.experience.length > 0,
      profile.certifications.length > 0,
      !!profile.resume,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  });

  readonly profileChecklist = computed(() => {
    const profile = this.profile();
    return [
      { labelKey: 'CANDIDATE.SHELL.CHECKLIST.ADD_SKILLS', done: profile.skills.length > 0, route: '/candidate/profile' },
      { labelKey: 'CANDIDATE.SHELL.CHECKLIST.ADD_EXPERIENCE', done: profile.experience.length > 0, route: '/candidate/profile' },
      { labelKey: 'CANDIDATE.SHELL.CHECKLIST.UPLOAD_RESUME', done: !!profile.resume, route: '/candidate/profile' },
    ];
  });

  readonly canBecomeFreelancer = computed(() => !this.auth.isFreelancer() && !this.freelancerRequestPending());

  freelancerRequestPending(): boolean {
    const currentUser = this.auth.currentUser();
    if (!currentUser) {
      return false;
    }
    return this.freelancerRequests.findByUser(currentUser.id)?.status === 'pending';
  }

  applyForFreelancer(): void {
    const currentUser = this.auth.currentUser();
    if (!currentUser || this.freelancerRequestPending()) {
      return;
    }
    this.freelancerRequests.create(currentUser.id);
  }

  markMessageRead(id: string): void {
    this._messages.update(messages =>
      messages.map(message => (message.id === id ? { ...message, read: true } : message)),
    );
  }

  markNotificationRead(id: string): void {
    this._notifications.update(notifications =>
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }

  updateVisibility(visible: boolean): void {
    this._profile.update(profile => ({ ...profile, visibility: visible }));
  }

  updatePassword(_password: string): boolean {
    return true;
  }

  uploadResume(name: string): void {
    this._profile.update(profile => ({
      ...profile,
      resume: {
        name,
        uploadedAt: new Date().toISOString().slice(0, 10),
        sizeLabel: 'New upload',
      },
    }));
  }

  private translateValue(value: string, dictionary: Record<string, string>, params?: Record<string, string>): string {
    const key = dictionary[value];
    return key ? this.translate.instant(key, params) : value;
  }

  private translateKeyOrFallback(key: string, fallback: string, params?: Record<string, string>): string {
    const translated = this.translate.instant(key, params);
    return translated === key ? fallback : translated;
  }

  private translateJobTitle(title: string | undefined): string {
    if (!title) {
      return this.translate.instant('CANDIDATE.ACTIVITY.ROLE_FALLBACK');
    }

    const key = `JOBS.CARD.TITLES.${title.toUpperCase().replace(/[()]/g, '').replace(/[^A-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')}`;
    const translated = this.translate.instant(key);
    return translated === key ? title : translated;
  }

  private translateApplicationStatus(status: string): string {
    const key = this.jobService.getApplicationStatusKey(status);
    const translated = this.translate.instant(key);
    return translated === key ? status : translated;
  }

  private formatDisplayDate(date: string, language: 'en' | 'ar'): string {
    return formatDate(date, 'MMM d', language);
  }
}
