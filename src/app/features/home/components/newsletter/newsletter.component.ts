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

  onSubmit(): void {
    // Handle newsletter subscription
    this.email = '';
  }
}
