import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

export interface NewsletterImage {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  loading: 'eager' | 'lazy';
}

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective],
  templateUrl: './newsletter.component.html'
})
export class NewsletterComponent {
  @Input() newsletterImage?: NewsletterImage;

  email = '';

  readonly newsletterFallback =
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&h=720&fit=crop&crop=entropy&q=70&auto=format,compress';

  get backgroundImage(): string {
    return `url('${this.newsletterImage?.src ?? this.newsletterFallback}')`;
  }

  onSubmit(): void {
    // Handle newsletter subscription
    this.email = '';
  }
}
