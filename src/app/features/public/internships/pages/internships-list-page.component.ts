import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { ContentInternship, ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-internships-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-page-hero
        title="Internships"
        subtitle="Launch your career with verified internship opportunities."
        badge="Student Friendly"
        bgClass="bg-gradient-to-br from-cyan-700 to-blue-700">
      </app-page-hero>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        @if (error()) { <p class="text-red-600 mb-4">{{ error() }}</p> }
        @if (loading()) { <p>Loading internships...</p> }
        @if (!loading() && !error() && internships().length === 0) { <p>No internships found</p> }

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (internship of internships(); track internship.id) {
            <a [routerLink]="['/internships', internship.id]" class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block">
              <img src="https://source.unsplash.com/featured/?internship,office" [alt]="internship.title" class="h-44 w-full object-cover" />
              <div class="p-5">
                <h2 class="font-semibold text-lg text-slate-900 group-hover:text-blue-600 line-clamp-2">{{ internship.title }}</h2>
                <p class="text-sm text-slate-500 mt-1">{{ internship.companyName }} • {{ internship.location }}</p>
                <div class="mt-3 text-sm text-slate-700 space-y-1">
                  <p>Duration: {{ internshipDuration(internship) }}</p>
                  <p>Stipend: {{ internship.stipend ?? 'Not specified' }}</p>
                </div>
              </div>
            </a>
          }
        </div>
      </section>
    </div>
  `
})
export class InternshipsListPageComponent implements OnInit {
  private readonly contentService = inject(ContentService);

  protected readonly internships = signal<ContentInternship[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.contentService.getInternships().subscribe({
      next: internships => {
        this.internships.set(internships);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.status === 500 ? 'Server error while loading internships.' : 'Failed to load internships.');
        this.loading.set(false);
      }
    });
  }

  protected internshipDuration(internship: ContentInternship): string {
    return (internship as any).duration || 'Flexible';
  }
}

