import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="alignment === 'center' ? 'text-center' : 'text-left'">
      @if (label) {
        <p class="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">{{ label }}</p>
      }
      <h2 class="text-2xl md:text-3xl font-bold text-slate-900">{{ title }}</h2>
      @if (subtitle) {
        <p class="mt-3 text-base text-slate-500 max-w-2xl" [class.mx-auto]="alignment === 'center'">{{ subtitle }}</p>
      }
    </div>
  `
})
export class SectionHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() label = '';
  @Input() subtitle = '';
  @Input() alignment: 'left' | 'center' = 'center';
}
