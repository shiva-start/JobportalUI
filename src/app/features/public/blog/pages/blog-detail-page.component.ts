import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentBlogPost, ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="max-w-4xl mx-auto p-6">
      <a routerLink="/blog" class="text-blue-600">Back to Blog</a>
      @if (error()) { <p class="text-red-600 mt-4">{{ error() }}</p> }
      @if (loading()) { <p class="mt-4">Loading blog...</p> }
      @if (!loading() && post()) {
        <article class="mt-4 border rounded-xl p-6 bg-white shadow-card">
          <img src="https://source.unsplash.com/featured/?technology,blog" [alt]="post()!.title" class="h-64 w-full object-cover rounded-lg mb-5" />
          <h1 class="text-3xl font-bold">{{ post()!.title }}</h1>
          <p class="text-sm text-slate-500 mt-1">By {{ post()!.author || 'Admin' }} • {{ post()!.createdAt | date:'medium' }}</p>
          <p class="mt-4 whitespace-pre-line leading-7 text-slate-700">{{ post()!.content }}</p>
        </article>
      }
    </section>
  `
})
export class BlogDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly contentService = inject(ContentService);

  protected readonly post = signal<ContentBlogPost | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('404 Not Found');
      this.loading.set(false);
      return;
    }

    this.contentService.getBlogPostById(id).subscribe({
      next: post => {
        this.post.set(post);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.status === 404 ? '404 Not Found' : 'Failed to load blog details.');
        this.loading.set(false);
      }
    });
  }
}

