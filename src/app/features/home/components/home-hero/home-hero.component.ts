import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

export interface HomeHeroSearch {
  keyword: string;
  location: string;
}

export interface HomeHeroQuickSearch {
  labelKey: string;
  value: string;
}

export interface HomeHeroStat {
  value: string;
  labelKey: string;
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
  imports: [CommonModule, FormsModule, RevealDirective, TranslatePipe],
  templateUrl: './home-hero.component.html'
})
export class HomeHeroComponent {
  // @Input() badgeText = 'Over 1,200 new positions added this week';
  @Input() titleLeadKey = 'HOME.HERO.TITLE_LEAD';
  @Input() titleHighlightKey = 'HOME.HERO.TITLE_HIGHLIGHT';
  @Input() descriptionKey = 'HOME.HERO.DESCRIPTION';
  @Input() popularSearches: HomeHeroQuickSearch[] = [];
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

  applyQuickSearch(search: HomeHeroQuickSearch): void {
    this.searchKeyword = search.value;
    this.submitSearch();
  }
}
