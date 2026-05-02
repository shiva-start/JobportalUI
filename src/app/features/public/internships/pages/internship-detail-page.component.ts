import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentInternship, ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-internship-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="max-w-4xl mx-auto p-6">
      <a routerLink="/internships" class="text-blue-600">Back to Internships</a>
      @if (error()) { <p class="text-red-600 mt-4">{{ error() }}</p> }
      @if (loading()) { <p class="mt-4">Loading internship...</p> }
      @if (!loading() && internship()) {
        <article class="mt-4 border rounded-xl p-6 bg-white shadow-card">
          <img src="https://source.unsplash.com/featured/?internship,office" [alt]="internship()!.title" class="h-64 w-full object-cover rounded-lg mb-5" />
          <h1 class="text-3xl font-bold">{{ internship()!.title }}</h1>
          <p class="text-sm text-slate-500 mt-1">{{ internship()!.companyName }} • {{ internship()!.location }}</p>
          <p class="mt-4">Stipend: {{ internship()!.stipend ?? 'Not specified' }}</p>
          <p class="text-sm text-slate-500 mt-3">Posted: {{ internship()!.createdAt | date:'mediumDate' }}</p>
        </article>
      }
    </section>
  `
})
export class InternshipDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly contentService = inject(ContentService);

  protected readonly internship = signal<ContentInternship | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('404 Not Found');
      this.loading.set(false);
      return;
    }

    this.contentService.getInternshipById(id).subscribe({
      next: internship => {
        this.internship.set(internship);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.status === 404 ? '404 Not Found' : 'Failed to load internship details.');
        this.loading.set(false);
      }
    });
  }
}

