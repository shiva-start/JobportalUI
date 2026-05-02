import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { ContentService } from '../../../../core/services/content.service';

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
  private readonly contentService = inject(ContentService);

  @Input() newsletterImage?: NewsletterImage;

  email = '';
  statusMessage = signal('');
  statusType = signal<'success' | 'error' | ''>('');

  readonly newsletterFallback =
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&h=720&fit=crop&crop=entropy&q=70&auto=format,compress';

  get backgroundImage(): string {
    return `url('${this.newsletterImage?.src ?? this.newsletterFallback}')`;
  }

  onSubmit(): void {
    this.statusMessage.set('');
    this.statusType.set('');

    this.contentService.subscribeNewsletter(this.email).subscribe({
      next: () => {
        this.statusType.set('success');
        this.statusMessage.set('Subscribed successfully.');
        this.email = '';
      },
      error: err => {
        if (err.status === 400) {
          this.statusMessage.set('Invalid email address.');
        } else if (err.status === 500) {
          this.statusMessage.set('Server error. Please try again.');
        } else {
          this.statusMessage.set('Subscription failed.');
        }
        this.statusType.set('error');
      }
    });
  }
}
