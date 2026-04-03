import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-candidate-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="mt-2 text-sm text-gray-500">Manage account security and recruiter visibility.</p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="bg-white rounded-xl shadow-sm p-5">
          <h2 class="font-semibold text-gray-900">Change password</h2>
          <p class="mt-1 text-sm text-gray-500">{{ auth.currentUser()?.email }}</p>
          <input
            [(ngModel)]="password"
            type="password"
            placeholder="Enter a new password"
            class="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
          <button type="button" (click)="updatePassword()" class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Update password
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="font-semibold text-gray-900">Profile visibility</h2>
              <p class="mt-1 text-sm text-gray-500">Allow recruiters to discover your candidate profile.</p>
            </div>
            <label class="inline-flex cursor-pointer items-center">
              <input type="checkbox" [ngModel]="candidate.profile().visibility" (ngModelChange)="setVisibility($event)" class="h-5 w-5 rounded border-gray-300 text-blue-600">
            </label>
          </div>
          <p class="mt-4 text-sm text-gray-400">
            {{ candidate.profile().visibility ? 'Recruiters can view your profile.' : 'Your profile is hidden from recruiter search.' }}
          </p>
        </div>
      </div>
    </section>
  `,
})
export class CandidateSettingsPageComponent {
  readonly auth = inject(AuthService);
  readonly candidate = inject(CandidateDashboardService);
  private readonly toast = inject(ToastService);

  password = '';

  updatePassword(): void {
    if (!this.password.trim()) {
      this.toast.error('Please enter a new password.');
      return;
    }
    this.candidate.updatePassword(this.password);
    this.password = '';
    this.toast.success('Password updated.');
  }

  setVisibility(visible: boolean): void {
    this.candidate.updateVisibility(visible);
    this.toast.success(visible ? 'Profile is now visible.' : 'Profile visibility updated.');
  }
}
