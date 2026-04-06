import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { BlogCardComponent } from '../components/blog-card/blog-card.component';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../../../../models';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, BlogCardComponent],
  template: `
    @if (post()) {
      <div class="min-h-screen bg-gray-50">

        <!-- Breadcrumb -->
        <div class="bg-white border-b border-slate-200">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-slate-500">
            <a routerLink="/" class="hover:text-blue-600">Home</a>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <a routerLink="/blog" class="hover:text-blue-600">Blog</a>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span class="text-slate-700 font-medium truncate">{{ post()!.title }}</span>
          </div>
        </div>

        <!-- Article -->
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <!-- Article header -->
          <header class="mb-8">
            <div class="flex items-center gap-2 mb-4">
              <app-badge [variant]="categoryVariant">{{ post()!.category }}</app-badge>
              <span class="text-xs text-slate-400">{{ post()!.readTimeMinutes }} min read</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-5">{{ post()!.title }}</h1>
            <p class="text-lg text-slate-600 leading-relaxed mb-6">{{ post()!.excerpt }}</p>

            <!-- Author + Meta row -->
            <div class="flex items-center justify-between flex-wrap gap-4 py-5 border-y border-slate-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {{ post()!.author.avatar }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800">{{ post()!.author.name }}</p>
                  <p class="text-xs text-slate-500">{{ post()!.author.bio }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <p class="text-xs text-slate-400">{{ post()!.publishedAt | date:'MMMM d, y' }}</p>
                <!-- Share buttons -->
                <div class="flex items-center gap-2">
                  <button class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all duration-200">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                  <button class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all duration-200">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <!-- Cover image -->
          <div class="rounded-2xl overflow-hidden mb-8 shadow-card">
            <img [src]="post()!.coverImage" [alt]="post()!.title" class="w-full h-72 object-cover"/>
          </div>

          <!-- Article body -->
          <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-card mb-8">
            <p class="text-base text-slate-700 leading-relaxed">{{ post()!.content }}</p>
            <!-- In production, render HTML content with [innerHTML] or a markdown renderer here -->
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-10">
            @for (tag of post()!.tags; track tag) {
              <span class="text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-medium">#{{ tag }}</span>
            }
          </div>

          <!-- Back link -->
          <a routerLink="/blog" class="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Blog
          </a>
        </article>

        <!-- Related Articles -->
        @if (related().length > 0) {
          <section class="py-12 bg-white border-t border-slate-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 class="text-2xl font-bold text-slate-900 mb-6">Related Articles</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (relPost of related(); track relPost.id) {
                  <app-blog-card [post]="relPost"/>
                }
              </div>
            </div>
          </section>
        }
      </div>
    } @else {
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <p class="text-slate-500 mb-4">Article not found.</p>
          <a routerLink="/blog" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Back to Blog</a>
        </div>
      </div>
    }
  `
})
export class BlogDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  post = signal<BlogPost | undefined>(undefined);
  related = signal<BlogPost[]>([]);

  get categoryVariant(): 'blue' | 'green' | 'orange' | 'purple' | 'teal' {
    const map: Record<string, 'blue' | 'green' | 'orange' | 'purple' | 'teal'> = {
      'Tech': 'blue', 'Career Tips': 'green', 'Freelancing': 'purple',
      'Industry News': 'orange', 'Interviews': 'teal',
    };
    return map[this.post()?.category ?? ''] ?? 'blue';
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = this.blogService.getBySlug(slug);
    this.post.set(found);
    if (found) this.related.set(this.blogService.getRelated(found));
  }
}
