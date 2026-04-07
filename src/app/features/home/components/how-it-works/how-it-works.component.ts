import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

export interface HowItWorksStep {
  step: number;
  titleKey: string;
  descriptionKey: string;
  svgPath: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RevealDirective, TranslatePipe],
  templateUrl: './how-it-works.component.html'
})
export class HowItWorksComponent {
  @Input() steps: HowItWorksStep[] = [];
}
