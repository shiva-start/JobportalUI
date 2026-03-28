import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Job } from '../../../../models/index';
import { JobCardComponent } from '../../../../shared/components/job-card/job-card.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';

export interface FeaturedJobsBanner {
  src: string;
  srcset: string;
  sizes: string;
  alt: string;
  width: number;
  height: number;
  loading: 'eager' | 'lazy';
}

@Component({
  selector: 'app-featured-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent, SkeletonComponent, RevealDirective],
  templateUrl: './featured-jobs.component.html'
})
export class FeaturedJobsComponent {
  @Input() loading = false;
  @Input() featuredJobs: Job[] = [];
  @Input() skeletonItems: number[] = [1, 2, 3];
  @Input() featuredJobsBanner?: FeaturedJobsBanner;
  @Input() savedJobIds: Set<string> = new Set();

  @Output() saveToggle = new EventEmitter<string>();

  isJobSaved(id: string): boolean {
    return this.savedJobIds.has(id);
  }
}
