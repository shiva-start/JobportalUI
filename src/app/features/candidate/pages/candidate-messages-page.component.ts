import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';

@Component({
  selector: 'app-candidate-messages-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900">Messages</h1>
        <p class="mt-2 text-sm text-gray-500">Recruiter communication is ready with a clean placeholder experience.</p>
      </div>

      <div *ngIf="candidate.messages().length; else empty" class="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        <button
          *ngFor="let message of candidate.messages()"
          type="button"
          (click)="candidate.markMessageRead(message.id)"
          class="w-full px-5 py-4 text-left transition hover:bg-gray-50"
          [class.bg-blue-50]="!message.read"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ message.from }} <span class="font-normal text-gray-400">at {{ message.company }}</span></p>
              <p class="mt-1 text-sm text-gray-700">{{ message.subject }}</p>
              <p class="mt-1 text-sm text-gray-500">{{ message.preview }}</p>
            </div>
            <span class="text-xs text-gray-400">{{ message.date | date:'mediumDate' }}</span>
          </div>
        </button>
      </div>

      <ng-template #empty>
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-400">No data available</p>
        </div>
      </ng-template>
    </section>
  `,
})
export class CandidateMessagesPageComponent {
  readonly candidate = inject(CandidateDashboardService);
}
