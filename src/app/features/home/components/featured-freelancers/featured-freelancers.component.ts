import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FreelancerCardComponent } from '../../../../shared/components/freelancer-card/freelancer-card.component';
import { FreelancerService } from '../../../../core/services/freelancer.service';

@Component({
  selector: 'app-featured-freelancers',
  standalone: true,
  imports: [RouterLink, FreelancerCardComponent, TranslatePipe],
  template: `
    <section class="py-16 md:py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="space-y-3 text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">{{ 'FREELANCERS.FEATURED.TITLE' | translate }}</h2>
          <p class="text-slate-600 text-base max-w-2xl mx-auto">{{ 'FREELANCERS.FEATURED.DESCRIPTION' | translate }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          @if (freelancers.length) {
            @for (freelancer of freelancers; track freelancer.id) {
              <app-freelancer-card [freelancer]="freelancer"></app-freelancer-card>
            }
          } @else {
            <p class="col-span-3 text-center text-gray-400 py-8">{{ 'FREELANCERS.FEATURED.EMPTY' | translate }}</p>
          }
        </div>

        <div class="flex justify-center mt-12">
          <a routerLink="/freelancers" class="inline-flex items-center gap-2 px-6 py-3 text-blue-600 font-semibold text-sm bg-white border border-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
            {{ 'FREELANCERS.FEATURED.BROWSE_ALL' | translate }}
            <svg class="w-4 h-4 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `
})
export class FeaturedFreelancersComponent {
  private fs = inject(FreelancerService);
  freelancers = this.fs.list().filter(f => f.status === 'approved').slice(0, 3);
}
