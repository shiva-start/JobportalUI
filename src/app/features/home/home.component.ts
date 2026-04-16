import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';
import { HomeHeroComponent, HomeHeroQuickSearch, HomeHeroSearch } from './components/home-hero/home-hero.component';
import { JobCategoriesComponent, JobCategory } from './components/job-categories/job-categories.component';
import { HowItWorksComponent, HowItWorksStep } from './components/how-it-works/how-it-works.component';
import { CtaDualPanelComponent, CtaImage } from './components/cta-dual-panel/cta-dual-panel.component';
import { TestimonialsComponent, Testimonial } from './components/testimonials/testimonials.component';
import { FeaturedFreelancersComponent } from "./components/featured-freelancers/featured-freelancers.component";
import { GetStartedCtaComponent } from './components/get-started-cta/get-started-cta.component';

type ImageLoading = 'eager' | 'lazy';

interface LandingImage {
  alt: string;
  height: number;
  loading: ImageLoading;
  sizes: string;
  src: string;
  srcset: string;
  width: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeHeroComponent,
    JobCategoriesComponent,
    HowItWorksComponent,
    CtaDualPanelComponent,
    TestimonialsComponent,
    FeaturedFreelancersComponent,
    GetStartedCtaComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private readonly responsiveWidths = [320, 480, 640, 768, 960, 1200, 1600];
  private router = inject(Router);
  jobService = inject(JobService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  loading = signal(true);
  skeletonItems = [1, 2, 3];

  popularSearches: HomeHeroQuickSearch[] = [
    { labelKey: 'HOME.HERO.POPULAR_SEARCHES.REACT_DEVELOPER', value: 'React Developer' },
    { labelKey: 'HOME.HERO.POPULAR_SEARCHES.PRODUCT_MANAGER', value: 'Product Manager' },
    { labelKey: 'HOME.HERO.POPULAR_SEARCHES.UI_DESIGNER', value: 'UI Designer' },
    { labelKey: 'HOME.HERO.POPULAR_SEARCHES.REMOTE', value: 'Remote' },
    { labelKey: 'HOME.HERO.POPULAR_SEARCHES.DATA_ANALYST', value: 'Data Analyst' }
  ];

  stats = [
    { value: '0+', labelKey: 'HOME.HERO.STATS.LIVE_JOBS' },
    { value: '500+', labelKey: 'HOME.HERO.STATS.COMPANIES' },
    { value: '10K+', labelKey: 'HOME.HERO.STATS.CANDIDATES' },
    { value: '2K+', labelKey: 'HOME.HERO.STATS.NEW_JOBS' },
  ];

  categories: JobCategory[] = [
    {
      id: '1', value: 'Technology', labelKey: 'HOME.CATEGORIES.ITEMS.TECHNOLOGY', count: 284,
      bgClass: 'bg-blue-100', iconClass: 'text-blue-600',
      svgPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      image: this.createImage('photo-1518770660439-4636190af475', 640, 520, {
        alt: 'Developer working on software code across multiple monitors',
        loading: 'lazy' as ImageLoading,
        sizes: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw'
      })
    },
    {
      id: '2', value: 'Design', labelKey: 'HOME.CATEGORIES.ITEMS.DESIGN', count: 97,
      bgClass: 'bg-purple-100', iconClass: 'text-purple-600',
      svgPath: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      image: this.createImage('photo-1498050108023-c5249f4df085', 640, 520, {
        alt: 'Designer workspace with laptop, sketches, and visual design tools',
        loading: 'lazy' as ImageLoading,
        sizes: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw'
      })
    },
    {
      id: '3', value: 'Marketing', labelKey: 'HOME.CATEGORIES.ITEMS.MARKETING', count: 156,
      bgClass: 'bg-pink-100', iconClass: 'text-pink-600',
      svgPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
      image: this.createImage('photo-1460925895917-afdab827c52f', 640, 520, {
        alt: 'Marketing team reviewing campaign charts and growth metrics',
        loading: 'lazy' as ImageLoading,
        sizes: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw'
      })
    },
    {
      id: '4', value: 'Sales', labelKey: 'HOME.CATEGORIES.ITEMS.SALES', count: 213,
      bgClass: 'bg-green-100', iconClass: 'text-green-600',
      svgPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      image: this.createImage('photo-1556740749-887f6717d7e4', 640, 520, {
        alt: 'Sales professionals in a client meeting closing a deal',
        loading: 'lazy' as ImageLoading,
        sizes: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw'
      })
    },
    {
      id: '5', value: 'Data & AI', labelKey: 'HOME.CATEGORIES.ITEMS.DATA_AI', count: 118,
      bgClass: 'bg-indigo-100', iconClass: 'text-indigo-600',
      svgPath: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
      image: this.createImage('photo-1504384308090-c894fdcc538d', 640, 520, {
        alt: 'Data analyst workstation with dashboards and AI-focused visuals',
        loading: 'lazy' as ImageLoading,
        sizes: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw'
      })
    },
    {
      id: '6', value: 'Product', labelKey: 'HOME.CATEGORIES.ITEMS.PRODUCT', count: 74,
      bgClass: 'bg-orange-100', iconClass: 'text-orange-600',
      svgPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      image: this.createImage('photo-1451187580459-43490279c0fa', 640, 520, {
        alt: 'Product team planning roadmap ideas with sticky notes and laptops',
        loading: 'lazy' as ImageLoading,
        sizes: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw'
      })
    },
    {
      id: '7', value: 'Human Resources', labelKey: 'HOME.CATEGORIES.ITEMS.HUMAN_RESOURCES', count: 89,
      bgClass: 'bg-teal-100', iconClass: 'text-teal-600',
      svgPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      image: this.createImage('photo-1521737604893-d14cc237f11d', 640, 520, {
        alt: 'Human resources interview or onboarding conversation in an office',
        loading: 'lazy' as ImageLoading,
        sizes: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw'
      })
    },
    {
      id: '8', value: 'Finance', labelKey: 'HOME.CATEGORIES.ITEMS.FINANCE', count: 132,
      bgClass: 'bg-yellow-100', iconClass: 'text-yellow-600',
      svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      image: this.createImage('photo-1554224155-6726b3ff858f', 640, 520, {
        alt: 'Finance professional reviewing budgets and financial reports',
        loading: 'lazy' as ImageLoading,
        sizes: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw'
      })
    },
  ];

  landingImages = {
    heroImage: this.createImage('photo-1600880292203-757bb62b4baf', 1000, 1200, { alt: 'Diverse team of professionals collaborating in a modern office', loading: 'eager' as ImageLoading, sizes: '(min-width: 1024px) 50vw, 100vw' }),
    featuredJobsBanner: this.createImage('photo-1552664730-d307ca884978', 720, 420, {
      alt: 'Hiring team reviewing candidate profiles during a planning session',
      loading: 'lazy' as ImageLoading,
      sizes: '(min-width: 1024px) 28vw, 100vw'
    }),
    ctaJobSeekers: this.createImage('photo-1486312338219-ce68d2c6f44d', 900, 620, {
      alt: 'Professional exploring career opportunities on a laptop',
      loading: 'lazy' as ImageLoading,
      sizes: '(min-width: 1024px) 40vw, 100vw'
    }),
    ctaEmployers: this.createImage('photo-1552664730-d307ca884978', 900, 620, {
      alt: 'Hiring team collaborating in a modern corporate meeting',
      loading: 'lazy' as ImageLoading,
      sizes: '(min-width: 1024px) 40vw, 100vw'
    }),
    newsletter: this.createImage('photo-1521737711867-e3b97375f902', 1600, 720, {
      alt: 'Professionals collaborating in a modern office while reviewing opportunities',
      loading: 'lazy' as ImageLoading,
      sizes: '100vw'
    })
  };

  howItWorksSteps: HowItWorksStep[] = [
    {
      step: 1,
      titleKey: 'HOME.HOW_IT_WORKS.STEPS.CREATE_ACCOUNT.TITLE',
      descriptionKey: 'HOME.HOW_IT_WORKS.STEPS.CREATE_ACCOUNT.DESCRIPTION',
      svgPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      step: 2,
      titleKey: 'HOME.HOW_IT_WORKS.STEPS.SEARCH_JOBS.TITLE',
      descriptionKey: 'HOME.HOW_IT_WORKS.STEPS.SEARCH_JOBS.DESCRIPTION',
      svgPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    },
    {
      step: 3,
      titleKey: 'HOME.HOW_IT_WORKS.STEPS.GET_HIRED.TITLE',
      descriptionKey: 'HOME.HOW_IT_WORKS.STEPS.GET_HIRED.DESCRIPTION',
      svgPath: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Mohamed Khalil',
      roleKey: 'HOME.TESTIMONIALS.ITEMS.MOHAMED.ROLE',
      avatar: this.createImage('photo-1500648767791-00dcc994a43e', 80, 80, {
        alt: 'Portrait of Mohamed Khalil',
        loading: 'lazy' as ImageLoading,
        sizes: '40px'
      }),
      quoteKey: 'HOME.TESTIMONIALS.ITEMS.MOHAMED.QUOTE'
    },
    {
      name: 'Rana Ibrahim',
      roleKey: 'HOME.TESTIMONIALS.ITEMS.RANA.ROLE',
      avatar: this.createImage('photo-1573496359142-b8d87734a5a2', 80, 80, {
        alt: 'Portrait of Rana Ibrahim',
        loading: 'lazy' as ImageLoading,
        sizes: '40px'
      }),
      quoteKey: 'HOME.TESTIMONIALS.ITEMS.RANA.QUOTE'
    },
    {
      name: 'Tarek Nasser',
      roleKey: 'HOME.TESTIMONIALS.ITEMS.TAREK.ROLE',
      avatar: this.createImage('photo-1560250097-0b93528c311a', 80, 80, {
        alt: 'Portrait of Tarek Nasser',
        loading: 'lazy' as ImageLoading,
        sizes: '40px'
      }),
      quoteKey: 'HOME.TESTIMONIALS.ITEMS.TAREK.QUOTE'
    },
  ];

  savedJobIds = new Set<string>();

  constructor() {
    setTimeout(() => this.loading.set(false), 800);
  }

  onHeroSearch(search: HomeHeroSearch): void {
    this.jobService.setFilters({ keyword: search.keyword, location: search.location });
    this.router.navigate(['/jobs']);
  }

  onCategorySelected(category: string): void {
    this.jobService.setFilters({ category });
    this.router.navigate(['/jobs']);
  }

  onSaveJob(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
    const saved = this.jobService.isJobSaved(jobId);
    this.toastService.success(
      this.translate.instant(saved ? 'JOBS.TOASTS.SAVED' : 'JOBS.TOASTS.REMOVED')
    );
    // Rebuild the set so Angular detects the change via input binding
    this.savedJobIds = new Set(
      this.jobService.featuredJobs()
        .map(j => j.id)
        .filter(id => this.jobService.isJobSaved(id))
    );
  }
  private createImage(
    id: string,
    width: number,
    height: number,
    options: { alt: string; loading: ImageLoading; quality?: number; sizes: string }
  ): LandingImage {
    const quality = options.quality ?? 70;

    return {
      alt: options.alt,
      height,
      loading: options.loading,
      sizes: options.sizes,
      src: this.unsplashUrl(id, width, height, quality),
      srcset: this.responsiveWidths
        .filter((candidateWidth) => candidateWidth <= Math.max(width * 2, 640))
        .map((candidateWidth) => {
          const scaledHeight = Math.round((height / width) * candidateWidth);
          return `${this.unsplashUrl(id, candidateWidth, scaledHeight, quality)} ${candidateWidth}w`;
        })
        .join(', '),
      width
    };
  }

  private unsplashUrl(id: string, width: number, height: number, quality: number): string {
    return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&crop=entropy&q=${quality}&auto=format,compress`;
  }
}
