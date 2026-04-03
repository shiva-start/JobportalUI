import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-employer-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
            <p class="mt-2 text-sm text-gray-500">Employer account controls for your hiring workspace.</p>

            <input
              [(ngModel)]="password"
              type="password"
              placeholder="Enter a new password"
              class="mt-5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
            <button
              type="button"
              (click)="savePassword()"
              class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Update Password
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900">Workspace</h2>
            <p class="mt-2 text-sm text-gray-500">{{ auth.currentUser()?.email }}</p>
            <div class="mt-5 rounded-xl bg-gray-50 p-4">
              <p class="text-sm text-gray-600">Notifications and team settings can be added here as the employer module grows.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EmployerSettingsComponent {
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  password = '';

  savePassword(): void {
    if (!this.password.trim()) {
      this.toast.error('Please enter a new password.');
      return;
    }
    this.password = '';
    this.toast.success('Password updated.');
  }
}
