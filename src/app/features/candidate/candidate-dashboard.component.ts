import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { CandidateResume, CandidateResumeService } from '../../core/services/candidate-resume.service';
import { CandidateFreelancerRequestService } from '../../core/services/candidate-freelancer-request.service';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';
import { JobCardComponent } from '../../shared/components/job-card/job-card.component';
import { BadgeComponent, BadgeVariant } from '../../shared/components/badge/badge.component';
import { CandidateSkillsComponent } from './components/candidate-skills.component';
import { CandidateExperienceComponent } from './components/candidate-experience.component';
import type {
  ApplicationStatus,
  Education,
  WorkExperience,
  Certification,
  RecruiterMessage,
} from '../../models';

type Tab = 'overview' | 'applied' | 'saved' | 'messages' | 'profile' | 'settings';
interface CandidateProfileResponse {
  headline: string | null;
  summary: string | null;
  currentLocation: string | null;
  resumeUrl: string | null;
  skills: string[];
}

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, JobCardComponent, BadgeComponent, CandidateSkillsComponent, CandidateExperienceComponent],
  templateUrl: './candidate-dashboard.component.html',
})
export class CandidateDashboardComponent implements OnInit {
  auth = inject(AuthService);
  jobService = inject(JobService);
  private api = inject(ApiService);
  private http = inject(HttpClient);
  private resumeService = inject(CandidateResumeService);
  private toastService = inject(ToastService);
  private cfReq = inject(CandidateFreelancerRequestService);
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

  activeTab = signal<Tab>('overview');
  isEditMode = false;
  isSavingProfile = false;
  isUploadingResume = false;
  selectedFile: File | null = null;
  resume: CandidateResume | null = null;
  private resumePath: string | null = null;
  profileForm = {
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    summary: '',
  };

  appliedJobs = () => this.jobService.getAppliedJobs();
  savedJobs   = () => this.jobService.getSavedJobs();
  recommendedJobs = () => this.jobService.featuredJobs().slice(0, 4);

  ngOnInit(): void {
    this.seedProfileForm();
    this.loadProfile();
    this.loadResume();
  }

  get unreadCount() {
    return this.messages.filter(m => !m.read).length;
  }

  get navItems() {
    return [
      { id: 'overview'  as Tab, label: 'Overview',     badge: null as number | null, svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'applied'   as Tab, label: 'Applications', badge: this.appliedJobs().length || null, svgPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 'saved'     as Tab, label: 'Saved Jobs',   badge: null as number | null, svgPath: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
      { id: 'messages'  as Tab, label: 'Messages',     badge: this.unreadCount || null, svgPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      { id: 'profile'   as Tab, label: 'My Profile',   badge: null as number | null, svgPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { id: 'settings'  as Tab, label: 'Settings',     badge: null as number | null, svgPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.07c1.516-.94 3.31.826 2.37 2.342a1.724 1.724 0 001.07 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.07 2.573c.94 1.516-.826 3.31-2.342 2.37a1.724 1.724 0 00-2.573 1.07c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.07c-1.516.94-3.31-.826-2.37-2.342a1.724 1.724 0 00-1.07-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.07-2.573c-.94-1.516.826-3.31 2.342-2.37.1.062.208.115.32.16' },
    ];
  }

  get stats() {
    const details = this.jobService.getApplicationDetails();
    return [
      { value: details.length, label: 'Applications', change: '+2 this week', positive: true },
      { value: details.filter(a => a.status === 'shortlisted' || a.status === 'interview-scheduled').length, label: 'Shortlisted', change: null, positive: true },
      { value: details.filter(a => a.status === 'rejected').length, label: 'Rejected', change: null, positive: false },
      { value: this.savedJobs().length, label: 'Saved Jobs', change: null, positive: true },
    ];
  }

  // ── Application status helpers ──────────────────────────────────────────────
  getApplicationStatus(jobId: string): ApplicationStatus {
    return this.jobService.getApplicationStatus(jobId);
  }

  getApplicationDate(jobId: string): string {
    return this.jobService.getApplicationDate(jobId);
  }

  getStatusVariant(status: ApplicationStatus): BadgeVariant {
    const map: Record<ApplicationStatus, BadgeVariant> = {
      'applied':             'blue',
      'under-review':        'orange',
      'shortlisted':         'green',
      'interview-scheduled': 'indigo',
      'rejected':            'red',
      'selected':            'teal',
    };
    return map[status];
  }

  getStatusLabel(status: ApplicationStatus): string {
    const map: Record<ApplicationStatus, string> = {
      'applied':             'Applied',
      'under-review':        'Under Review',
      'shortlisted':         'Shortlisted',
      'interview-scheduled': 'Interview Scheduled',
      'rejected':            'Rejected',
      'selected':            'Offer Received',
    };
    return map[status];
  }

  // ── Mock profile data ───────────────────────────────────────────────────────
  demoSkills = ['Angular', 'TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'GraphQL', 'Git'];

  education: Education[] = [
    {
      id: 'e1',
      degree: 'Bachelor of Science',
      institution: 'Cairo University',
      field: 'Computer Science',
      startYear: 2015,
      endYear: 2019,
      grade: '3.8 / 4.0',
    },
    {
      id: 'e2',
      degree: 'High School Diploma',
      institution: 'Al-Azhar Secondary School',
      field: 'Science',
      startYear: 2012,
      endYear: 2015,
    },
  ];

  experience: WorkExperience[] = [
    {
      id: 'x1',
      title: 'Senior Frontend Developer',
      company: 'TechNova Solutions',
      location: 'Cairo, Egypt',
      startDate: 'Jan 2022',
      endDate: 'Present',
      current: true,
      description:
        'Leading frontend architecture for 3 flagship products. Mentoring a team of 4 junior developers and driving adoption of Angular 17 with standalone components and signals.',
    },
    {
      id: 'x2',
      title: 'Frontend Developer',
      company: 'DigitalWave Agency',
      location: 'Cairo, Egypt',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      current: false,
      description:
        'Built responsive web applications for clients in e-commerce, healthcare, and fintech sectors using React and TypeScript.',
    },
  ];

  certifications: Certification[] = [
    {
      id: 'c1',
      name: 'AWS Certified Developer – Associate',
      issuer: 'Amazon Web Services',
      issuedDate: 'Sep 2023',
      expiryDate: 'Sep 2026',
    },
    {
      id: 'c2',
      name: 'Google UX Design Certificate',
      issuer: 'Google / Coursera',
      issuedDate: 'Mar 2022',
    },
  ];

  messages: RecruiterMessage[] = [
    {
      id: 'm1',
      from: 'Sara Mostafa',
      company: 'TechNova Solutions',
      avatar: 'SM',
      subject: 'Regarding your Senior Frontend Developer Application',
      preview: 'Hi Ahmed, we reviewed your application and would love to schedule a technical interview…',
      date: '2026-04-01',
      read: false,
    },
    {
      id: 'm2',
      from: 'Ali Karimi',
      company: 'FinEdge Corp',
      avatar: 'AK',
      subject: 'Interview Invitation – Product Manager Role',
      preview: 'Dear Ahmed, congratulations! We are pleased to invite you for the next round of interviews…',
      date: '2026-03-29',
      read: false,
    },
    {
      id: 'm3',
      from: 'Nadia Farouk',
      company: 'CloudSphere Inc',
      avatar: 'NF',
      subject: 'Application Update – Full Stack Developer',
      preview: 'Thank you for your application. After careful consideration we have decided to move forward with other candidates…',
      date: '2026-03-27',
      read: true,
    },
  ];

  // ── Actions ─────────────────────────────────────────────────────────────────
  get isFreelancer() { return this.auth.isFreelancer(); }

  get freelancerRequestPending() {
    const cur = this.auth.currentUser();
    if (!cur) return false;
    const r = this.cfReq.findByUser(cur.id);
    return !!r && r.status === 'pending';
  }

  applyForFreelancer() {
    const cur = this.auth.currentUser();
    if (!cur) return this.toastService.error('Not signed in');
    this.cfReq.create({ bio: null, portfolioUrl: null, hourlyRate: 0 }).subscribe({
      next: () => this.toastService.success('Freelancer request submitted - awaiting admin review.'),
      error: () => this.toastService.error('Unable to submit freelancer request.'),
    });
  }

  getFirstName(): string {
    return this.auth.currentUser()?.name?.split(' ')[0] ?? 'there';
  }

  onSaveJob(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
    this.toastService.success(this.jobService.isJobSaved(jobId) ? 'Job saved!' : 'Job removed.');
  }

  markMessageRead(id: string) {
    const msg = this.messages.find(m => m.id === id);
    if (msg) msg.read = true;
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.seedProfileForm();
      this.profileForm.skills = this.demoSkills.join(', ');
      this.profileForm.experience = this.experience[0]?.title ?? '';
      this.profileForm.summary = this.auth.currentUser()?.bio ?? '';
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.seedProfileForm();
  }

  saveProfile(): void {
    const currentUser = this.auth.currentUser();
    if (!currentUser) {
      this.toastService.error('User session not found.');
      return;
    }

    this.isSavingProfile = true;
    const [firstName, ...lastNameParts] = (this.profileForm.name || '').trim().split(' ');
    const lastName = lastNameParts.join(' ');
    const skills = (this.profileForm.skills || '')
      .split(',')
      .map(x => x.trim())
      .filter(Boolean);

    this.api.put('users/me', {
      firstName: firstName || currentUser.name,
      lastName: lastName || '',
      phoneNumber: this.profileForm.phone || null,
    }).subscribe({
      next: () => {
        this.api.put<CandidateProfileResponse, unknown>('candidate/profile', {
          headline: this.profileForm.experience || null,
          summary: this.profileForm.summary || null,
          resumeUrl: this.resumePath,
          desiredSalary: null,
          currentLocation: null,
          openToRelocate: false,
          skills,
        }).subscribe({
          next: () => {
            this.demoSkills = skills;
            this.toastService.success('Profile updated successfully.');
            this.isEditMode = false;
            this.isSavingProfile = false;
            this.auth.getCurrentUser().subscribe();
          },
          error: () => {
            this.isSavingProfile = false;
            this.toastService.error('Failed to save candidate profile.');
          },
        });
      },
      error: () => {
        this.isSavingProfile = false;
        this.toastService.error('Failed to save account information.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  uploadResume(): void {
    const currentUser = this.auth.currentUser();
    if (!this.selectedFile || !currentUser) {
      return;
    }

    this.isUploadingResume = true;
    this.resumeService.uploadResume(this.selectedFile).subscribe({
      next: (uploaded) => {
        this.resume = uploaded;
        this.resumePath = uploaded.filePath;
        this.selectedFile = null;
        this.isUploadingResume = false;
        this.toastService.success('Resume uploaded successfully.');
      },
      error: () => {
        this.isUploadingResume = false;
        this.toastService.error('Resume upload failed.');
      },
    });
  }

  viewResume(): void {
    const currentUser = this.auth.currentUser();
    if (!currentUser) return;
    const url = `${this.apiBaseUrl}/${this.resume?.filePath ?? ''}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => window.open(URL.createObjectURL(blob), '_blank'),
      error: () => this.toastService.error('Unable to open resume.'),
    });
  }

  downloadResume(): void {
    if (!this.resume) return;
    this.resumeService.downloadResume().subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = this.resume?.fileName || 'resume';
        link.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: () => this.toastService.error('Unable to download resume.'),
    });
  }

  deleteResume(): void {
    const currentUser = this.auth.currentUser();
    if (!currentUser) return;
    this.api.delete<void>(`candidate/resume/${currentUser.id}`).subscribe({
      next: () => {
        this.resume = null;
        this.toastService.success('Resume deleted.');
      },
      error: () => this.toastService.error('Unable to delete resume.'),
    });
  }

  private seedProfileForm(): void {
    const currentUser = this.auth.currentUser();
    this.profileForm = {
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? '',
      phone: currentUser?.phone ?? '',
      skills: this.demoSkills.join(', '),
      experience: this.experience[0]?.title ?? '',
      summary: currentUser?.bio ?? '',
    };
  }

  private loadProfile(): void {
    this.api.get<CandidateProfileResponse | null>('candidate/profile').subscribe({
      next: (profile) => {
        if (!profile) return;
        this.profileForm.skills = profile.skills.join(', ');
        this.profileForm.summary = profile.summary ?? this.profileForm.summary;
        this.profileForm.experience = profile.headline ?? this.profileForm.experience;
        this.resumePath = profile.resumeUrl ?? null;
        if (profile.skills.length) {
          this.demoSkills = profile.skills;
        }
      },
    });
  }

  private loadResume(): void {
    this.resumeService.getResume().subscribe({
      next: (data) => {
        this.resume = data;
        this.resumePath = data.filePath;
      },
      error: () => {
        this.resume = null;
      },
    });
  }
}


