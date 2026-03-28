import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

export interface HomeHeroSearch {
  keyword: string;
  location: string;
}

export interface HomeHeroStat {
  value: string;
  label: string;
}

export interface HeroImage {
  src: string;
  srcset: string;
  sizes: string;
  alt: string;
  loading: 'eager' | 'lazy';
}

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealDirective],
  templateUrl: './home-hero.component.html'
})
export class HomeHeroComponent {
  @Input() badgeText = 'Over 1,200 new positions added this week';
  @Input() titleLead = 'Find Work That';
  @Input() titleHighlight = 'Moves You Forward';
  @Input() description =
    'Connect with industry-leading companies hiring right now. Search thousands of roles across every field and level.';
  @Input() popularSearches: string[] = [];
  @Input() stats: HomeHeroStat[] = [];
  @Input() heroImage?: HeroImage;

  @Output() searchSubmitted = new EventEmitter<HomeHeroSearch>();

  searchKeyword = '';
  searchLocation = '';

  submitSearch(): void {
    this.searchSubmitted.emit({
      keyword: this.searchKeyword.trim(),
      location: this.searchLocation.trim()
    });
  }

  applyQuickSearch(term: string): void {
    this.searchKeyword = term;
    this.submitSearch();
  }
}
