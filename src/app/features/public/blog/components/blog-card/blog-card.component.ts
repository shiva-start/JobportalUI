import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogPost } from '../../../../../models';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [RouterLink, CommonModule, BadgeComponent],
  template: `
    <article class="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-blue-300 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">

      <!-- Thumbnail -->
      <div class="relative overflow-hidden h-48 bg-slate-100">
        <img [src]="post.coverImage" [alt]="post.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div class="absolute top-3 left-3">
          <app-badge [variant]="categoryVariant">{{ post.category }}</app-badge>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col flex-1 p-5 space-y-3">

        <!-- Author + Date -->
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {{ post.author.avatar }}
          </div>
          <span class="text-xs text-slate-500">{{ post.author.name }}</span>
          <span class="text-slate-300">·</span>
          <span class="text-xs text-slate-400">{{ post.publishedAt | date:'MMM d' }}</span>
          <span class="text-slate-300">·</span>
          <span class="text-xs text-slate-400">{{ post.readTimeMinutes }} min read</span>
        </div>

        <!-- Title -->
        <a [routerLink]="['/blog', post.slug]"
           class="block text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-snug">
          {{ post.title }}
        </a>

        <!-- Excerpt -->
        <p class="text-xs text-slate-500 leading-relaxed line-clamp-2">{{ post.excerpt }}</p>

        <div class="flex-grow"></div>

        <!-- Tags + Read link -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <div class="flex gap-1.5 flex-wrap">
            @for (tag of post.tags.slice(0,2); track tag) {
              <span class="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">#{{ tag }}</span>
            }
          </div>
          <a [routerLink]="['/blog', post.slug]"
             class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 flex-shrink-0">
            Read
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `
})
export class BlogCardComponent {
  @Input({ required: true }) post!: BlogPost;

  get categoryVariant(): 'blue' | 'green' | 'orange' | 'purple' | 'teal' | 'indigo' {
    const map: Record<string, 'blue' | 'green' | 'orange' | 'purple' | 'teal' | 'indigo'> = {
      'Tech': 'blue',
      'Career Tips': 'green',
      'Freelancing': 'purple',
      'Industry News': 'orange',
      'Interviews': 'teal',
    };
    return map[this.post.category] || 'blue';
  }
}
