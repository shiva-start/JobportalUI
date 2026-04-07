import { Component, Input, Inject, DestroyRef, PLATFORM_ID, inject, signal, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

export interface TestimonialAvatar {
  src: string;
  srcset: string;
  sizes: string;
  alt: string;
  width: number;
  height: number;
  loading: 'eager' | 'lazy';
}

export interface Testimonial {
  name: string;
  roleKey: string;
  avatar: TestimonialAvatar;
  quoteKey: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  @Input() testimonials: Testimonial[] = [];

  currentTestimonialIndex = signal(0);
  private destroyRef = inject(DestroyRef);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const intervalId = window.setInterval(() => {
        this.currentTestimonialIndex.update((i) => (i + 1) % this.testimonials.length);
      }, 5000);
      this.destroyRef.onDestroy(() => window.clearInterval(intervalId));
    }
  }

  selectTestimonial(index: number): void {
    this.currentTestimonialIndex.set(index);
  }

  nextTestimonial(): void {
    this.currentTestimonialIndex.update((i) => (i + 1) % this.testimonials.length);
  }

  previousTestimonial(): void {
    this.currentTestimonialIndex.update((i) => (i - 1 + this.testimonials.length) % this.testimonials.length);
  }
}
