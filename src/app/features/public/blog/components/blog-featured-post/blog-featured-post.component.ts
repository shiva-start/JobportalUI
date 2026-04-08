import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { BlogPost } from '../../../../../models';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { LanguageService } from '../../../../../core/services/language.service';

@Component({
  selector: 'app-blog-featured-post',
  standalone: true,
  imports: [RouterLink, CommonModule, BadgeComponent, TranslatePipe],
  template: `
    <article class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <div class="lg:flex">

        <!-- Image -->
        <div class="lg:w-1/2 overflow-hidden h-64 lg:h-auto bg-slate-100 relative">
          <img [src]="post.coverImage" [alt]="localizedTitle"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
          <div class="absolute top-4 left-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {{ 'BLOG.FEATURED.BADGE' | translate }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="lg:w-1/2 p-8 flex flex-col justify-center">
          <div class="flex items-center gap-2 mb-4">
            <app-badge variant="blue">{{ ('BLOG.CATEGORIES.' + categoryKey(post.category)) | translate }}</app-badge>
            <span class="text-xs text-slate-400">{{ 'BLOG.CARD.MIN_READ' | translate:{ count: post.readTimeMinutes } }}</span>
          </div>

          <a [routerLink]="['/blog', post.slug]"
             class="block text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 leading-snug">
            {{ localizedTitle }}
          </a>

          <p class="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-3">{{ localizedExcerpt }}</p>

          <!-- Author -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {{ post.author.avatar }}
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-700">{{ localizedAuthorName }}</p>
              <p class="text-xs text-slate-400">{{ localizedPublishedDate }}</p>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 mb-6">
            @for (tag of localizedTags; track tag) {
              <span class="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">#{{ tag }}</span>
            }
          </div>

          <a [routerLink]="['/blog', post.slug]"
             class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md self-start">
            {{ 'BLOG.FEATURED.READ_ARTICLE' | translate }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `
})
export class BlogFeaturedPostComponent {
  private readonly languageService = inject(LanguageService);

  @Input({ required: true }) post!: BlogPost;

  categoryKey(category: string): string {
    return category.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  }

  get localizedTitle(): string {
    return this.isArabic ? this.post.titleAr ?? this.post.title : this.post.title;
  }

  get localizedExcerpt(): string {
    return this.isArabic ? this.post.excerptAr ?? this.post.excerpt : this.post.excerpt;
  }

  get localizedAuthorName(): string {
    return this.isArabic ? this.post.author.nameAr ?? this.post.author.name : this.post.author.name;
  }

  get localizedTags(): string[] {
    return this.isArabic ? this.post.tagsAr ?? this.post.tags : this.post.tags;
  }

  get localizedPublishedDate(): string {
    return formatDate(this.post.publishedAt, 'MMMM d, y', this.isArabic ? 'ar' : 'en-US');
  }

  private get isArabic(): boolean {
    return this.languageService.currentLanguage() === 'ar';
  }
}
