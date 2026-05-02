import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { ContentBlogPost, ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-blog-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-page-hero
        title="Blog"
        subtitle="Insights, updates, and career guidance from our team and community."
        badge="Latest Articles"
        bgClass="bg-gradient-to-br from-sky-700 to-indigo-700">
      </app-page-hero>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        @if (error()) { <p class="text-red-600 mb-4">{{ error() }}</p> }
        @if (loading()) { <p>Loading blogs...</p> }
        @if (!loading() && !error() && posts().length === 0) { <p>No blogs available</p> }

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (post of posts(); track post.id) {
            <a [routerLink]="['/blog', post.id]" class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block">
              <img src="https://source.unsplash.com/featured/?technology,blog" [alt]="post.title" class="h-48 w-full object-cover" />
              <div class="p-5">
                <h2 class="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{{ post.title }}</h2>
                <p class="text-sm text-slate-500 mt-2">By {{ post.author || 'Admin' }} • {{ post.createdAt | date:'mediumDate' }}</p>
                <p class="text-sm mt-3 text-slate-700 line-clamp-3">{{ snippet(post.content) }}</p>
              </div>
            </a>
          }
        </div>
      </section>
    </div>
  `
})
export class BlogListPageComponent implements OnInit {
  private readonly contentService = inject(ContentService);

  protected readonly posts = signal<ContentBlogPost[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.contentService.getBlogPosts().subscribe({
      next: posts => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(this.toErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  protected snippet(content: string): string {
    return content.length > 150 ? `${content.slice(0, 150)}...` : content;
  }

  private toErrorMessage(error: { status?: number }): string {
    if (error.status === 500) return 'Server error while loading blogs.';
    return 'Failed to load blogs.';
  }
}

