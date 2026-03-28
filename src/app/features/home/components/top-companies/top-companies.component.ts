import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

export interface CompanyImage {
  src: string;
  srcset: string;
  sizes: string;
  alt: string;
  width: number;
  height: number;
  loading: 'eager' | 'lazy';
}

export interface TopCompany {
  name: string;
  openRoles: number;
  hiringFocus: string;
  image: CompanyImage;
}

@Component({
  selector: 'app-top-companies',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective],
  templateUrl: './top-companies.component.html'
})
export class TopCompaniesComponent {
  @Input() topCompanies: TopCompany[] = [];
}
