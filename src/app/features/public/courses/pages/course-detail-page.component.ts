import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { CoursesService } from '../services/courses.service';
import { Course } from '../../../../models';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, TranslatePipe],
  template: `
    @if (course()) {
      <div class="min-h-screen bg-gray-50">
        <div class="bg-white border-b border-slate-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-slate-500">
            <a routerLink="/" class="hover:text-blue-600">{{ 'COMMON.HOME' | translate }}</a>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <a routerLink="/courses" class="hover:text-blue-600">{{ 'NAV.COURSES' | translate }}</a>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            <span class="text-slate-700 font-medium truncate">{{ localizedTitle }}</span>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div class="lg:grid lg:grid-cols-3 lg:gap-10">
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
                <img [src]="course()!.thumbnail" [alt]="localizedTitle" class="w-full h-56 object-cover"/>
                <div class="p-8">
                  <div class="flex items-center gap-2 mb-3">
                    <app-badge [variant]="levelVariant">{{ levelLabel }}</app-badge>
                    <span class="text-xs text-slate-400">{{ localizedCategory }}</span>
                  </div>
                  <h1 class="text-2xl font-bold text-slate-900 mb-2">{{ localizedTitle }}</h1>
                  <p class="text-sm text-slate-600 leading-relaxed mb-5">{{ localizedDescription }}</p>

                  <div class="flex items-center gap-6 flex-wrap">
                    <div class="flex items-center gap-1.5">
                      @for (star of [1,2,3,4,5]; track star) {
                        <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                      <span class="text-sm font-bold text-slate-700 ml-1">{{ course()!.rating }}</span>
                      <span class="text-sm text-slate-400">{{ 'COURSES.DETAIL.STUDENTS' | translate:{ count: course()!.enrolledCount } }}</span>
                    </div>
                    <span class="text-xs text-slate-400">{{ 'COURSES.DETAIL.DURATION' | translate }}: <span class="text-slate-600 font-medium">{{ localizedDuration }}</span></span>
                    @if (course()!.certificateOffered) {
                      <span class="inline-flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md font-medium">
                        <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        {{ 'COURSES.DETAIL.CERTIFICATE' | translate }}
                      </span>
                    }
                  </div>
                </div>
              </div>

              <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
                <h2 class="text-lg font-bold text-slate-900 mb-4">{{ 'COURSES.DETAIL.INSTRUCTOR' | translate }}</h2>
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {{ course()!.instructorAvatar }}
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800">{{ localizedInstructorName }}</p>
                    <p class="text-sm text-slate-500">{{ 'COURSES.DETAIL.EXPERT_INSTRUCTOR' | translate:{ category: localizedCategory } }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
                <h2 class="text-lg font-bold text-slate-900 mb-4">{{ 'COURSES.DETAIL.SKILLS' | translate }}</h2>
                <div class="flex flex-wrap gap-2">
                  @for (skill of localizedSkills; track skill) {
                    <span class="text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                      <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                      {{ skill }}
                    </span>
                  }
                </div>
              </div>
            </div>

            <aside class="mt-8 lg:mt-0">
              <div class="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
                @if (course()!.price === 0) {
                  <p class="text-3xl font-bold text-green-600 mb-1">{{ 'COMMON.FREE' | translate }}</p>
                } @else {
                  <p class="text-3xl font-bold text-slate-900 mb-1">
                    ?{{ course()!.price | number }}
                  </p>
                }
                <p class="text-xs text-slate-400 mb-5">{{ 'COURSES.DETAIL.PAYMENT_NOTE' | translate }}</p>

                <button class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md mb-3">
                  {{ course()!.price === 0 ? ('COURSES.CARD.ENROLL_FOR_FREE' | translate) : ('COURSES.CARD.ENROLL_NOW' | translate) }}
                </button>
                <button class="w-full py-3.5 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-medium text-sm rounded-xl transition-all duration-200">
                  {{ 'COURSES.DETAIL.PREVIEW' | translate }}
                </button>

                <div class="mt-5 pt-5 border-t border-slate-100 space-y-3">
                  @for (feature of courseFeatures; track feature.labelKey) {
                    <div class="flex items-center gap-2.5 text-sm text-slate-600">
                      <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="feature.icon"/>
                      </svg>
                      {{ feature.labelKey | translate }}
                    </div>
                  }
                </div>

                <div class="mt-5 pt-5 border-t border-slate-100">
                  <a routerLink="/courses" class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    {{ 'COURSES.DETAIL.BACK' | translate }}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <p class="text-slate-500 mb-4">{{ 'COURSES.DETAIL.NOT_FOUND' | translate }}</p>
          <a routerLink="/courses" class="text-blue-600 hover:text-blue-700 text-sm font-medium">{{ 'COURSES.DETAIL.BROWSE' | translate }}</a>
        </div>
      </div>
    }
  `
})
export class CourseDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(CoursesService);
  private languageService = inject(LanguageService);

  course = signal<Course | undefined>(undefined);

  courseFeatures = [
    { labelKey: 'COURSES.DETAIL.FEATURES.LIFETIME_ACCESS', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { labelKey: 'COURSES.DETAIL.FEATURES.MOBILE_DESKTOP', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { labelKey: 'COURSES.DETAIL.FEATURES.COMMUNITY_SUPPORT', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { labelKey: 'COURSES.DETAIL.FEATURES.CERTIFICATE', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  ];

  get levelVariant(): 'green' | 'blue' | 'orange' {
    const map: Record<string, 'green' | 'blue' | 'orange'> = { Beginner: 'green', Intermediate: 'blue', Advanced: 'orange' };
    return map[this.course()?.level ?? ''] ?? 'blue';
  }

  get localizedTitle(): string {
    const course = this.course();
    if (!course) return '';
    return this.isArabic ? course.titleAr ?? course.title : course.title;
  }

  get localizedDescription(): string {
    const course = this.course();
    if (!course) return '';
    return this.isArabic ? course.descriptionAr ?? course.description : course.description;
  }

  get localizedInstructorName(): string {
    const course = this.course();
    if (!course) return '';
    return this.isArabic ? course.instructorNameAr ?? course.instructorName : course.instructorName;
  }

  get localizedCategory(): string {
    const course = this.course();
    if (!course) return '';
    return this.isArabic ? course.categoryAr ?? course.category : course.category;
  }

  get localizedDuration(): string {
    const course = this.course();
    if (!course) return '';
    return this.isArabic ? course.durationAr ?? course.duration : course.duration;
  }

  get localizedSkills(): string[] {
    const course = this.course();
    if (!course) return [];
    return this.isArabic ? course.skillsAr ?? course.skills : course.skills;
  }

  get levelLabel(): string {
    const course = this.course();
    if (!course) return '';

    const labels: Record<Course['level'], string> = {
      Beginner: this.isArabic ? 'مبتدئ' : 'Beginner',
      Intermediate: this.isArabic ? 'متوسط' : 'Intermediate',
      Advanced: this.isArabic ? 'متقدم' : 'Advanced',
    };

    return labels[course.level];
  }

  private get isArabic(): boolean {
    return this.languageService.currentLanguage() === 'ar';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.course.set(this.service.getById(id));
  }
}
