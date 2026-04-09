import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';

@Component({
  selector: 'app-candidate-messages-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.MESSAGES.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'CANDIDATE.MESSAGES.SUBTITLE' | translate }}</p>
      </div>

      @if (candidate.localizedMessages().length) {
        <div class="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          @for (message of candidate.localizedMessages(); track message.id) {
            <button
              type="button"
              (click)="candidate.markMessageRead(message.id)"
              class="w-full px-5 py-4 text-left transition hover:bg-gray-50 rtl:text-right"
              [class.bg-blue-50]="!message.read"
            >
              <div class="flex items-start justify-between gap-4 rtl:flex-row-reverse">
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-gray-900">
                    {{ message.from }}
                    <span class="font-normal text-gray-400">{{ 'CANDIDATE.MESSAGES.AT' | translate }} {{ message.company }}</span>
                  </p>
                  <p class="mt-1 text-sm text-gray-700">{{ message.subject }}</p>
                  <p class="mt-1 text-sm text-gray-500">{{ message.preview }}</p>
                </div>
                <span class="shrink-0 text-xs text-gray-400">{{ $any(message).dateLabel || (message.date | date:'mediumDate') }}</span>
              </div>
            </button>
          }
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
        </div>
      }
    </section>
  `,
})
export class CandidateMessagesPageComponent {
  readonly candidate = inject(CandidateDashboardService);
}
