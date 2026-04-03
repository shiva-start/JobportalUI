import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { CandidateCertificationsCardComponent } from '../components/candidate-certifications-card.component';
import { CandidateEducationCardComponent } from '../components/candidate-education-card.component';
import { CandidateExperienceCardComponent } from '../components/candidate-experience-card.component';
import { CandidateResumeCardComponent } from '../components/candidate-resume-card.component';
import { CandidateSkillsCardComponent } from '../components/candidate-skills-card.component';

@Component({
  selector: 'app-candidate-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    CandidateSkillsCardComponent,
    CandidateExperienceCardComponent,
    CandidateEducationCardComponent,
    CandidateCertificationsCardComponent,
    CandidateResumeCardComponent,
  ],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-semibold text-white">
            {{ auth.currentUser()?.avatar || auth.getInitials(auth.currentUser()?.name || 'Candidate') }}
          </div>
          <div class="min-w-0">
            <h1 class="text-2xl font-bold text-gray-900">{{ auth.currentUser()?.name }}</h1>
            <p class="text-sm text-gray-500">{{ profile().headline }}</p>
            <p class="mt-1 text-sm text-gray-400">{{ profile().location }}</p>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs uppercase tracking-wide text-gray-400">Email</p>
            <p class="mt-1 text-sm text-gray-700">{{ auth.currentUser()?.email || 'No data available' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs uppercase tracking-wide text-gray-400">Phone</p>
            <p class="mt-1 text-sm text-gray-700">{{ profile().phone || 'No data available' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="font-semibold text-gray-900">About</h2>
          <span class="text-xs font-medium text-blue-600">Read only preview</span>
        </div>
        <p class="text-sm leading-7 text-gray-600">{{ profile().about || 'No data available' }}</p>
      </div>

      <app-candidate-skills-card [skills]="profile().skills || []"></app-candidate-skills-card>
      <app-candidate-experience-card [experience]="profile().experience || []"></app-candidate-experience-card>
      <app-candidate-education-card [education]="profile().education || []"></app-candidate-education-card>
      <app-candidate-certifications-card [certifications]="profile().certifications || []"></app-candidate-certifications-card>
      <app-candidate-resume-card [resume]="profile().resume || null" (upload)="uploadResume()"></app-candidate-resume-card>
    </section>
  `,
})
export class CandidateProfilePageComponent {
  readonly auth = inject(AuthService);
  readonly candidate = inject(CandidateDashboardService);
  readonly profile = this.candidate.profile;

  uploadResume(): void {
    this.candidate.uploadResume('Updated_Candidate_Resume.pdf');
  }
}
