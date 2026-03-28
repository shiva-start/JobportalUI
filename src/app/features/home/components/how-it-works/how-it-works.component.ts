import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  svgPath: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  templateUrl: './how-it-works.component.html'
})
export class HowItWorksComponent {
  @Input() steps: HowItWorksStep[] = [];
}
