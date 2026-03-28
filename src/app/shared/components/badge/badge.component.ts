import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray' | 'indigo' | 'teal' | 'yellow';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="classes" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'blue';
  @Input() size: 'sm' | 'md' = 'sm';

  get classes(): string {
    const variantMap: Record<BadgeVariant, string> = {
      blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
      green: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
      purple: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20',
      orange: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20',
      red: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
      gray: 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-500/20',
      indigo: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20',
      teal: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20',
      yellow: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20',
    };
    return variantMap[this.variant] || variantMap['blue'];
  }
}
