import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { InternshipsService } from '../services/internships.service';
import { Internship } from '../../../../models';

@Component({
  selector: 'app-internship-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent],
  template: `
    @if (internship()) {
      <div class="min-h-screen bg-gray-50">

        <!-- Breadcrumb -->
        <div class="bg-white border-b border-slate-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-slate-500">
            <a routerLink="/" class="hover:text-blue-600 transition-colors">Home</a>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <a routerLink="/internships" class="hover:text-blue-600 transition-colors">Internships</a>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span class="text-slate-700 font-medium truncate">{{ internship()!.title }}</span>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div class="lg:grid lg:grid-cols-3 lg:gap-10">

            <!-- Main content -->
            <div class="lg:col-span-2 space-y-8">

              <!-- Header card -->
              <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-card">
                <div class="flex items-start gap-5">
                  <div [class]="logoColor" class="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                    {{ internship()!.companyLogo || internship()!.company.slice(0,2).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h1 class="text-2xl font-bold text-slate-900">{{ internship()!.title }}</h1>
                    <p class="text-base text-slate-500 mt-1">{{ internship()!.company }}</p>
                    <div class="flex flex-wrap gap-2 mt-3">
                      <app-badge variant="teal">Internship</app-badge>
                      <app-badge variant="blue">{{ internship()!.locationType }}</app-badge>
                    </div>
                  </div>
                </div>

                <!-- Metadata grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
                  @for (meta of metaItems(); track meta.label) {
                    <div>
                      <p class="text-xs text-slate-400 font-medium mb-1">{{ meta.label }}</p>
                      <p class="text-sm font-semibold text-slate-700">{{ meta.value }}</p>
                    </div>
                  }
                </div>
              </div>

              <!-- Description -->
              <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-card">
                <h2 class="text-lg font-bold text-slate-900 mb-4">About the Internship</h2>
                <p class="text-sm text-slate-600 leading-relaxed">{{ internship()!.description }}</p>
              </div>

              <!-- Requirements -->
              <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-card">
                <h2 class="text-lg font-bold text-slate-900 mb-4">Requirements</h2>
                <ul class="space-y-3">
                  @for (req of internship()!.requirements; track req) {
                    <li class="flex items-start gap-3 text-sm text-slate-600">
                      <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                      {{ req }}
                    </li>
                  }
                </ul>
              </div>

              <!-- Skills -->
              <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-card">
                <h2 class="text-lg font-bold text-slate-900 mb-4">Skills Required</h2>
                <div class="flex flex-wrap gap-2">
                  @for (skill of internship()!.skills; track skill) {
                    <span class="text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-medium">{{ skill }}</span>
                  }
                </div>
              </div>
            </div>

            <!-- Sticky sidebar -->
            <aside class="mt-8 lg:mt-0">
              <div class="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
                <div class="mb-5 pb-5 border-b border-slate-100">
                  @if (internship()!.stipend) {
                    <p class="text-2xl font-bold text-green-600">
                      {{ internship()!.stipendCurrency }} {{ internship()!.stipend | number }}
                      <span class="text-sm font-normal text-slate-400">/month</span>
                    </p>
                    <p class="text-xs text-slate-400 mt-0.5">Stipend</p>
                  } @else {
                    <p class="text-lg font-semibold text-slate-500">Unpaid Internship</p>
                  }
                </div>

                <button
                  class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md mb-3">
                  Apply Now
                </button>
                <button
                  class="w-full py-3.5 border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 font-medium text-sm rounded-xl transition-all duration-200">
                  Save Internship
                </button>

                <div class="mt-5 pt-5 border-t border-slate-100 space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Openings</span>
                    <span class="font-semibold text-slate-700">{{ internship()!.openings }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Start Date</span>
                    <span class="font-semibold text-slate-700">{{ internship()!.startDate | date:'MMM d, y' }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Apply by</span>
                    <span class="font-semibold text-red-600">{{ internship()!.deadline | date:'MMM d, y' }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Category</span>
                    <span class="font-semibold text-slate-700">{{ internship()!.category }}</span>
                  </div>
                </div>

                <div class="mt-5 pt-5 border-t border-slate-100">
                  <a routerLink="/internships" class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back to all internships
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
          <p class="text-slate-500 mb-4">Internship not found.</p>
          <a routerLink="/internships" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Browse all internships</a>
        </div>
      </div>
    }
  `
})
export class InternshipDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(InternshipsService);

  internship = signal<Internship | undefined>(undefined);

  get logoColor(): string {
    const colors = [
      'bg-gradient-to-br from-teal-500 to-teal-700',
      'bg-gradient-to-br from-blue-500 to-blue-700',
      'bg-gradient-to-br from-indigo-500 to-indigo-700',
    ];
    const id = this.internship()?.id ?? '';
    return colors[id.charCodeAt(id.length - 1) % colors.length];
  }

  metaItems() {
    const i = this.internship()!;
    return [
      { label: 'Duration', value: i.duration },
      { label: 'Location', value: i.locationType },
      { label: 'Start Date', value: new Date(i.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
      { label: 'Openings', value: `${i.openings} position${i.openings > 1 ? 's' : ''}` },
    ];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.internship.set(this.service.getById(id));
  }
}
