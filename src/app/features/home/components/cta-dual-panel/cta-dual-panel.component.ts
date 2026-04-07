import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [CommonModule, RouterLink, RevealDirective, TranslatePipe],
  templateUrl: './cta-dual-panel.component.html'
})
export class CtaDualPanelComponent {
  @Input() ctaJobSeekers?: CtaImage;
  @Input() ctaEmployers?: CtaImage;

  readonly jobSeekersFallback =
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=700&fit=crop&crop=entropy&q=75&auto=format,compress';
  readonly employersFallback =
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=700&fit=crop&crop=entropy&q=75&auto=format,compress';

  getPanelBackground(image: CtaImage | undefined, audience: 'job-seekers' | 'employers'): string {
    const fallback = audience === 'job-seekers' ? this.jobSeekersFallback : this.employersFallback;
    return `url('${image?.src ?? fallback}')`;
  }

  getPanelPosition(audience: 'job-seekers' | 'employers'): string {
    return audience === 'job-seekers' ? 'center 35%' : 'center 42%';
  }
}
