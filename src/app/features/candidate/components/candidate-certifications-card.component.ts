import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { Certification } from '../../../models';

@Component({
  selector: 'app-candidate-certifications-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div class="mb-5 flex items-center justify-between rtl:flex-row-reverse">
        <h2 class="font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.PROFILE.CERTIFICATIONS' | translate }}</h2>
        <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ 'CANDIDATE.PROFILE.ADD' | translate }}</button>
      </div>

      <ng-container *ngIf="certifications?.length; else empty">
        <div class="space-y-4">
          <div *ngFor="let cert of certifications" class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 class="text-sm font-semibold text-gray-900 rtl:text-right">{{ cert.name }}</h3>
            <p class="mt-1 text-sm text-gray-600 rtl:text-right">{{ cert.issuer }}</p>
            <p class="mt-2 text-xs text-gray-400 rtl:text-right">
              {{ 'CANDIDATE.PROFILE.ISSUED' | translate }} {{ cert.issuedDate }} · {{ 'CANDIDATE.PROFILE.EXPIRES' | translate }} {{ cert.expiryDate }}
            </p>
            <p class="hidden mt-2 text-xs text-gray-400 rtl:text-right">
              Issued {{ cert.issuedDate }}<span *ngIf="cert.expiryDate"> · Expires {{ cert.expiryDate }}</span>
            </p>
          </div>
        </div>
      </ng-container>

      <ng-template #empty>
        <p class="text-sm text-gray-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
      </ng-template>
    </div>
  `,
})
export class CandidateCertificationsCardComponent {
  @Input() certifications: Certification[] | null = [];
}
