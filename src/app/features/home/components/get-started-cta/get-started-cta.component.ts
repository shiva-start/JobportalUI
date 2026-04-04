import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-get-started-cta',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  templateUrl: './get-started-cta.component.html'
})
export class GetStartedCtaComponent {
  @Input() heading = 'Ready to Find Your Next Opportunity?';
  @Input() subtext =
    'Join thousands of professionals who found their dream jobs';
  @Input() buttonLabel = 'Get Started Now';
  @Input() buttonLink = '/register';
}
