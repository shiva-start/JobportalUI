import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

export interface CtaImage {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  loading: 'eager' | 'lazy';
}

@Component({
  selector: 'app-cta-dual-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  templateUrl: './cta-dual-panel.component.html'
})
export class CtaDualPanelComponent {
  @Input() ctaJobSeekers?: CtaImage;
  @Input() ctaEmployers?: CtaImage;
}
