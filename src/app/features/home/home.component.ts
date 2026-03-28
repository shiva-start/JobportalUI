import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';
import { JobCardComponent } from '../../shared/components/job-card/job-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { HomeHeroComponent, HomeHeroSearch } from './components/home-hero/home-hero.component';

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
  imports: [CommonModule, RouterLink, JobCardComponent, SkeletonComponent, HomeHeroComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private readonly responsiveWidths = [320, 480, 640, 768, 960, 1200, 1600];
  private router = inject(Router);
  jobService = inject(JobService);
  private toastService = inject(ToastService);

  searchKeyword = '';
  searchLocation = '';
  loading = signal(true);
  skeletonItems = [1, 2, 3];

  popularSearches = ['React Developer', 'Product Manager', 'UI Designer', 'Remote', 'Data Analyst'];

  stats = [
    { value: '12,000+', label: 'Active Jobs' },
    { value: '3,500+', label: 'Companies' },
    { value: '50,000+', label: 'Job Seekers' },
  ];

  categories = [
    {
      id: '1', name: 'Technology', count: 284,
      bgClass: 'bg-blue-100', iconClass: 'text-blue-600',
      svgPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
    {
      id: '2', name: 'Design', count: 97,
      bgClass: 'bg-purple-100', iconClass: 'text-purple-600',
      svgPath: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      id: '3', name: 'Marketing', count: 156,
      bgClass: 'bg-pink-100', iconClass: 'text-pink-600',
      svgPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
    },
    {
      id: '4', name: 'Sales', count: 213,
      bgClass: 'bg-green-100', iconClass: 'text-green-600',
      svgPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    },
    {
      id: '5', name: 'Data & AI', count: 118,
      bgClass: 'bg-indigo-100', iconClass: 'text-indigo-600',
      svgPath: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18'
    },
    {
      id: '6', name: 'Product', count: 74,
      bgClass: 'bg-orange-100', iconClass: 'text-orange-600',
      svgPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    },
    {
      id: '7', name: 'Human Resources', count: 89,
      bgClass: 'bg-teal-100', iconClass: 'text-teal-600',
      svgPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    {
      id: '8', name: 'Finance', count: 132,
      bgClass: 'bg-yellow-100', iconClass: 'text-yellow-600',
      svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
  ];

  landingImages = {
    featuredJobsBanner: this.createImage('photo-1517048676732-d65bc937f952', 720, 420, {
      alt: 'Hiring team reviewing candidate profiles during a planning session',
      loading: 'lazy',
      sizes: '(min-width: 1024px) 28vw, 100vw'
    }),
    ctaJobSeekers: this.createImage('photo-1499750310107-5fef28a66643', 800, 500, {
      alt: '',
      loading: 'lazy',
      sizes: '(min-width: 1024px) 40vw, 100vw'
    }),
    ctaEmployers: this.createImage('photo-1522071820081-009f0129c71c', 800, 500, {
      alt: '',
      loading: 'lazy',
      sizes: '(min-width: 1024px) 40vw, 100vw'
    }),
    newsletter: this.createImage('photo-1521737711867-e3b97375f902', 1400, 500, {
      alt: '',
      loading: 'lazy',
      sizes: '100vw'
    })
  };

  workplaceGallery = [
    this.createImage('photo-1497366216548-37526070297c', 400, 260, {
      alt: 'Open office workspace with glass meeting rooms and workstations',
      loading: 'lazy',
      sizes: '(min-width: 1024px) 16vw, 50vw'
    }),
    this.createImage('photo-1522202176988-66273c2fd55f', 400, 260, {
      alt: 'Team of professionals collaborating around a desk',
      loading: 'lazy',
      sizes: '(min-width: 1024px) 16vw, 50vw'
    }),
    this.createImage('photo-1497366754035-f200968a2f2f', 400, 260, {
      alt: 'Creative team in a bright office during a brainstorming session',
      loading: 'lazy',
      sizes: '(min-width: 1024px) 16vw, 50vw'
    }),
    this.createImage('photo-1551836022-d5d88e9218df', 400, 260, {
      alt: 'Professional woman reviewing work on a laptop in an office',
      loading: 'lazy',
      sizes: '(min-width: 1024px) 16vw, 50vw'
    })
  ];

  workplaceFeatures = [
    {
      title: 'Remote & Hybrid Options',
      description: 'Filter by work style - fully remote, hybrid, or on-site. Find roles that match your lifestyle.',
      bgClass: 'bg-blue-100', iconClass: 'text-blue-600',
      svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      title: 'Verified Company Profiles',
      description: 'Every employer is vetted. Read culture reviews, benefits, and interview tips before you apply.',
      bgClass: 'bg-emerald-100', iconClass: 'text-emerald-600',
      svgPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
    },
    {
      title: 'Salary Transparency',
      description: 'See compensation ranges upfront - no surprises, no wasted time in interviews.',
      bgClass: 'bg-purple-100', iconClass: 'text-purple-600',
      svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
  ];

  topCompanies = [
    {
      name: 'Stripe',
      openRoles: 24,
      hiringFocus: 'Payments engineering and platform security',
      image: this.createImage('photo-1520607162513-77705c0f0d4a', 520, 360, {
        alt: 'Modern fintech office with professionals discussing product strategy',
        loading: 'lazy',
        sizes: '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
      })
    },
    {
      name: 'Notion',
      openRoles: 11,
      hiringFocus: 'Product design and collaborative tools',
      image: this.createImage('photo-1516321318423-f06f85e504b3', 520, 360, {
        alt: 'Product team working together with shared screens in a meeting room',
        loading: 'lazy',
        sizes: '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
      })
    },
    {
      name: 'Vercel',
      openRoles: 9,
      hiringFocus: 'Developer experience and cloud infrastructure',
      image: this.createImage('photo-1516321165247-4aa89a48be28', 520, 360, {
        alt: 'Technology team reviewing dashboards and engineering metrics',
        loading: 'lazy',
        sizes: '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'
      })
    }
  ];

  howItWorks = [
    {
      step: 1,
      title: 'Create Your Profile',
      description: 'Sign up and build a professional profile that showcases your skills and experience in minutes.',
      svgPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      step: 2,
      title: 'Discover Opportunities',
      description: 'Browse thousands of jobs and use smart filters to find positions that match your goals.',
      svgPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    },
    {
      step: 3,
      title: 'Apply Instantly',
      description: 'Submit your application with one click and track every stage of your process in real time.',
      svgPath: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
  ];

  testimonials = [
    {
      name: 'Mohamed Khalil',
      role: 'Frontend Developer at TechCorp',
      avatar: this.createImage('photo-1507003211169-0a1dd7228f2d', 80, 80, {
        alt: 'Portrait of Mohamed Khalil',
        loading: 'lazy',
        sizes: '40px'
      }),
      quote: 'Found my dream job within 2 weeks of signing up. The platform made the entire process incredibly smooth and stress-free.'
    },
    {
      name: 'Rana Ibrahim',
      role: 'HR Manager at BuildScale',
      avatar: this.createImage('photo-1573496359142-b8d87734a5a2', 80, 80, {
        alt: 'Portrait of Rana Ibrahim',
        loading: 'lazy',
        sizes: '40px'
      }),
      quote: 'We have hired 5 exceptional engineers through JobPortal. The quality and relevance of candidates is consistently impressive.'
    },
    {
      name: 'Tarek Nasser',
      role: 'Senior Product Manager',
      avatar: this.createImage('photo-1560250097-0b93528c311a', 80, 80, {
        alt: 'Portrait of Tarek Nasser',
        loading: 'lazy',
        sizes: '40px'
      }),
      quote: 'The job alerts feature is a game changer. I received a notification about my current role before it appeared anywhere else.'
    },
  ];

  constructor() {
    setTimeout(() => this.loading.set(false), 800);
  }

  onSearch(): void {
    this.jobService.setFilters({ keyword: this.searchKeyword, location: this.searchLocation });
    this.router.navigate(['/jobs']);
  }

  onHeroSearch(search: HomeHeroSearch): void {
    this.searchKeyword = search.keyword;
    this.searchLocation = search.location;
    this.onSearch();
  }

  searchByCategory(category: string): void {
    this.jobService.setFilters({ category });
    this.router.navigate(['/jobs']);
  }

  onSaveJob(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
    const saved = this.jobService.isJobSaved(jobId);
    this.toastService.success(saved ? 'Job saved to your list.' : 'Job removed from saved.');
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
    return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&crop=entropy&q=${quality}&auto=format`;
  }
}
