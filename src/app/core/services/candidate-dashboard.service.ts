import { Injectable, computed, inject, signal } from '@angular/core';
import {
  CandidateActivity,
  CandidateNotification,
  CandidateProfile,
  RecruiterMessage,
} from '../../models';
import { AuthService } from './auth.service';
import { CandidateFreelancerRequestService } from './candidate-freelancer-request.service';
import { JobService } from './job.service';

@Injectable({ providedIn: 'root' })
export class CandidateDashboardService {
  private readonly auth = inject(AuthService);
  private readonly jobService = inject(JobService);
  private readonly freelancerRequests = inject(CandidateFreelancerRequestService);

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

  readonly recommendedJobs = computed(() =>
    this.jobService.filteredJobs()
      .filter(job => !this.jobService.isJobApplied(job.id))
      .slice(0, 6),
  );

  readonly dashboardStats = computed(() => {
    const details = this.jobService.getApplicationDetails();
    return [
      { label: 'Total Applications', value: details.length, tone: 'blue' },
      {
        label: 'Shortlisted',
        value: details.filter(detail => detail.status === 'shortlisted').length,
        tone: 'green',
      },
      {
        label: 'Interviews',
        value: details.filter(detail => detail.status === 'interview-scheduled').length,
        tone: 'amber',
      },
    ];
  });

  readonly recentActivity = computed<CandidateActivity[]>(() => {
    const applicationActivity = this.jobService.getApplicationDetails().slice(0, 3).map(detail => {
      const job = this.jobService.getJobById(detail.jobId);
      return {
        id: `a-${detail.jobId}`,
        title: `Application update: ${job?.title ?? 'Role'}`,
        description: `Status is ${this.jobService.formatApplicationStatus(detail.status)} at ${job?.company ?? 'the employer'}.`,
        date: detail.appliedAt,
      };
    });

    const messageActivity = this._messages().slice(0, 2).map(message => ({
      id: `m-${message.id}`,
      title: `Message from ${message.from}`,
      description: message.subject,
      date: message.date,
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
      { label: 'Add Skills', done: profile.skills.length > 0, route: '/candidate/profile' },
      { label: 'Add Experience', done: profile.experience.length > 0, route: '/candidate/profile' },
      { label: 'Upload Resume', done: !!profile.resume, route: '/candidate/profile' },
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
}
