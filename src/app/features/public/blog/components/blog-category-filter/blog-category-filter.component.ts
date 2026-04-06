import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCategory } from '../../../../../models';

@Component({
  selector: 'app-blog-category-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap gap-2">
      <button
        (click)="select.emit('')"
        [class]="!active
          ? 'px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-sm'
          : 'px-4 py-2 rounded-full text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all duration-200'">
        All
      </button>
      @for (cat of categories; track cat) {
        <button
          (click)="select.emit(cat)"
          [class]="active === cat
            ? 'px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-sm'
            : 'px-4 py-2 rounded-full text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all duration-200'">
          {{ cat }}
        </button>
      }
    </div>
  `
})
export class BlogCategoryFilterComponent {
  @Input({ required: true }) categories!: BlogCategory[];
  @Input() active: BlogCategory | '' = '';
  @Output() select = new EventEmitter<BlogCategory | ''>();
}
