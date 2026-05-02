import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';
import { CandidateResumeService } from '../../../core/services/candidate-resume.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { WorkExperience } from '../../../models';
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
    FormsModule,
    TranslatePipe,
    CandidateSkillsCardComponent,
    CandidateExperienceCardComponent,
    CandidateEducationCardComponent,
    CandidateCertificationsCardComponent,
    CandidateResumeCardComponent,
  ],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center rtl:sm:flex-row-reverse">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-semibold text-white">
            {{ auth.currentUser()?.avatar || auth.getInitials(auth.currentUser()?.name || 'Candidate') }}
          </div>
          <div class="min-w-0 rtl:text-right">
            <h1 class="text-2xl font-bold text-gray-900">{{ auth.currentUser()?.name }}</h1>
            <p class="text-sm text-gray-500">{{ profile().headline }}</p>
            <p class="mt-1 text-sm text-gray-400">{{ profile().location }}</p>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button type="button" (click)="toggleEditProfile()" class="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50">
            {{ editingProfile ? 'Cancel' : 'Edit Profile' }}
          </button>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs uppercase tracking-wide text-gray-400 rtl:text-right">{{ 'CANDIDATE.PROFILE.EMAIL' | translate }}</p>
            <p class="mt-1 text-sm text-gray-700 rtl:text-right">{{ auth.currentUser()?.email || ('CANDIDATE.NO_DATA' | translate) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs uppercase tracking-wide text-gray-400 rtl:text-right">{{ 'CANDIDATE.PROFILE.PHONE' | translate }}</p>
            <p class="mt-1 text-sm text-gray-700 rtl:text-right">{{ profile().phone || ('CANDIDATE.NO_DATA' | translate) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <div class="mb-3 flex items-center justify-between rtl:flex-row-reverse">
          <h2 class="font-semibold text-gray-900 rtl:text-right">{{ 'CANDIDATE.PROFILE.ABOUT' | translate }}</h2>
          <span *ngIf="!editingProfile" class="text-xs font-medium text-blue-600">{{ 'CANDIDATE.PROFILE.READ_ONLY_PREVIEW' | translate }}</span>
        </div>

        <ng-container *ngIf="editingProfile; else readOnlyProfile">
          <div class="grid grid-cols-1 gap-3">
            <input [(ngModel)]="editModel.headline" type="text" placeholder="Headline" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input [(ngModel)]="editModel.location" type="text" placeholder="Location" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <textarea [(ngModel)]="editModel.about" rows="4" placeholder="About" class="rounded-lg border border-gray-300 px-3 py-2 text-sm"></textarea>
          </div>
          <div class="mt-3 flex justify-end">
            <button type="button" (click)="saveProfile()" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Save
            </button>
          </div>
        </ng-container>

        <ng-template #readOnlyProfile>
          <p class="text-sm leading-7 text-gray-600 rtl:text-right">{{ profile().about || ('CANDIDATE.NO_DATA' | translate) }}</p>
        </ng-template>
      </div>

      <div *ngIf="addingSkill" class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div class="flex gap-2">
          <input [(ngModel)]="newSkill" type="text" placeholder="Enter skill" class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <button type="button" (click)="saveSkill()" class="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">Add</button>
          <button type="button" (click)="addingSkill=false" class="rounded-lg border border-gray-300 px-3 py-2 text-sm">Cancel</button>
        </div>
      </div>

      <div *ngIf="addingExperience" class="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-2">
        <input [(ngModel)]="experienceForm.title" type="text" placeholder="Title" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input [(ngModel)]="experienceForm.company" type="text" placeholder="Company" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input [(ngModel)]="experienceForm.location" type="text" placeholder="Location" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <div class="grid grid-cols-2 gap-2">
          <input [(ngModel)]="experienceForm.startDate" type="text" placeholder="Start Date" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input [(ngModel)]="experienceForm.endDate" type="text" placeholder="End Date" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <textarea [(ngModel)]="experienceForm.description" rows="3" placeholder="Description" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"></textarea>
        <div class="flex justify-end gap-2">
          <button type="button" (click)="addingExperience=false" class="rounded-lg border border-gray-300 px-3 py-2 text-sm">Cancel</button>
          <button type="button" (click)="saveExperience()" class="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">Add Experience</button>
        </div>
      </div>

      <app-candidate-skills-card [skills]="profile().skills || []" (add)="addingSkill=true"></app-candidate-skills-card>
      <app-candidate-experience-card [experience]="profile().experience || []" (add)="addingExperience=true"></app-candidate-experience-card>
      <app-candidate-education-card [education]="profile().education || []"></app-candidate-education-card>
      <app-candidate-certifications-card [certifications]="profile().certifications || []"></app-candidate-certifications-card>
      <app-candidate-resume-card [resume]="profile().resume || null" (upload)="openResumePicker()"></app-candidate-resume-card>
      <input #resumeInput type="file" accept=".pdf,.doc,.docx" class="hidden" (change)="onResumePicked($event)" />
    </section>
  `,
})
export class CandidateProfilePageComponent {
  readonly auth = inject(AuthService);
  readonly candidate = inject(CandidateDashboardService);
  readonly resumeService = inject(CandidateResumeService);
  readonly toast = inject(ToastService);
  readonly profile = this.candidate.profile;

  @ViewChild('resumeInput') resumeInput?: ElementRef<HTMLInputElement>;

  editingProfile = false;
  addingSkill = false;
  addingExperience = false;
  newSkill = '';

  editModel = {
    headline: '',
    location: '',
    about: '',
  };

  experienceForm = {
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  };

  toggleEditProfile(): void {
    this.editingProfile = !this.editingProfile;
    if (this.editingProfile) {
      const p = this.profile();
      this.editModel = {
        headline: p.headline || '',
        location: p.location || '',
        about: p.about || '',
      };
    }
  }

  saveProfile(): void {
    this.candidate.updateProfileBasics(this.editModel.headline, this.editModel.about, this.editModel.location);
    this.editingProfile = false;
    this.toast.success('Profile updated.');
  }

  saveSkill(): void {
    if (!this.newSkill.trim()) {
      return;
    }
    this.candidate.addSkill(this.newSkill);
    this.newSkill = '';
    this.addingSkill = false;
    this.toast.success('Skill added.');
  }

  saveExperience(): void {
    if (!this.experienceForm.title.trim() || !this.experienceForm.company.trim()) {
      return;
    }

    const experience: WorkExperience = {
      id: crypto.randomUUID(),
      title: this.experienceForm.title.trim(),
      company: this.experienceForm.company.trim(),
      location: this.experienceForm.location.trim(),
      startDate: this.experienceForm.startDate.trim() || 'N/A',
      endDate: this.experienceForm.endDate.trim() || 'Present',
      current: !this.experienceForm.endDate.trim(),
      description: this.experienceForm.description.trim(),
    };

    this.candidate.addExperience(experience);
    this.experienceForm = { title: '', company: '', location: '', startDate: '', endDate: '', description: '' };
    this.addingExperience = false;
    this.toast.success('Experience added.');
  }

  openResumePicker(): void {
    this.resumeInput?.nativeElement.click();
  }

  onResumePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.resumeService.uploadResume(file).subscribe({
      next: (resume) => {
        this.candidate.uploadResume(resume.fileName);
        this.toast.success('Resume uploaded.');
      },
      error: () => this.toast.error('Resume upload failed.'),
    });
  }
}

