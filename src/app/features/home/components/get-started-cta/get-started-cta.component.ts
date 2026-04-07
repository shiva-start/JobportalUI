import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-get-started-cta',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, TranslatePipe],
  templateUrl: './get-started-cta.component.html'
})
export class GetStartedCtaComponent {
  @Input() headingKey = 'HOME.GET_STARTED.TITLE';
  @Input() subtextKey = 'HOME.GET_STARTED.DESCRIPTION';
  @Input() buttonLabelKey = 'HOME.GET_STARTED.BUTTON';
  @Input() buttonLink = '/register';
}
