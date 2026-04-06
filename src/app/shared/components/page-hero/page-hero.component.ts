import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [class]="'relative overflow-hidden ' + bgClass">
      <!-- Background grid pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)"/>
        </svg>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div class="text-center max-w-3xl mx-auto animate-fade-in">
          @if (badge) {
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 mb-5">
              {{ badge }}
            </span>
          }
          <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {{ title }}
          </h1>
          @if (subtitle) {
            <p class="text-lg md:text-xl text-white/80 leading-relaxed">
              {{ subtitle }}
            </p>
          }
          <ng-content></ng-content>
        </div>
      </div>

      <!-- Wave bottom -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full" preserveAspectRatio="none">
          <path d="M0 40L60 34.7C120 29.3 240 18.7 360 16C480 13.3 600 18.7 720 21.3C840 24 960 24 1080 21.3C1200 18.7 1320 13.3 1380 10.7L1440 8V40H1380C1320 40 1200 40 1080 40C960 40 840 40 720 40C600 40 480 40 360 40C240 40 120 40 60 40H0Z" fill="#f8fafc"/>
        </svg>
      </div>
    </section>
  `
})
export class PageHeroComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
  @Input() badge = '';
  @Input() bgClass = 'bg-gradient-to-br from-blue-700 to-blue-600';
}
