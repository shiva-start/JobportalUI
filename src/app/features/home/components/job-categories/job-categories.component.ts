import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

export interface JobCategory {
  id: string;
  value: string;
  labelKey: string;
  count: number;
  bgClass: string;
  iconClass: string;
  svgPath: string;
  image: {
    alt: string;
    height: number;
    loading: 'eager' | 'lazy';
    sizes: string;
    src: string;
    srcset: string;
    width: number;
  };
}

@Component({
  selector: 'app-job-categories',
  standalone: true,
  imports: [CommonModule, RevealDirective, TranslatePipe],
  templateUrl: './job-categories.component.html'
})
export class JobCategoriesComponent {
  @Input() categories: JobCategory[] = [];
  @Output() categorySelected = new EventEmitter<string>();
}
