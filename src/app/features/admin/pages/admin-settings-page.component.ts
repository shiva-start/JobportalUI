import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { FaqItem, HelpService, UpsertFaqRequest } from '../../public/help/services/help.service';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule],
  template: `
    <section [attr.dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900 rtl:text-right">FAQ Management</h2>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">Create, edit, and remove FAQs for the Help page.</p>

        @if (error()) {
          <p class="mt-3 text-sm text-red-600">{{ error() }}</p>
        }

        <form [formGroup]="faqForm" (ngSubmit)="saveFaq()" class="mt-4 grid grid-cols-1 gap-3">
          <input class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" formControlName="question" placeholder="Question" />
          <textarea class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[100px]" formControlName="answer" placeholder="Answer"></textarea>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" formControlName="isActive" />
            Active
          </label>
          <div class="flex gap-2">
            <button type="submit" [disabled]="saving() || faqForm.invalid" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {{ editingId() ? 'Update FAQ' : 'Create FAQ' }}
            </button>
            @if (editingId()) {
              <button type="button" (click)="cancelEdit()" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">Cancel</button>
            }
          </div>
        </form>

        @if (loading()) {
          <p class="mt-4 text-sm text-gray-500">Loading FAQs...</p>
        } @else {
          <div class="mt-4 space-y-2">
            @for (faq of faqs(); track faq.id) {
              <div class="rounded-lg border border-gray-200 p-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-medium text-gray-900">{{ faq.question }}</p>
                    <p class="mt-1 text-sm text-gray-600">{{ faq.answer }}</p>
                    <p class="mt-1 text-xs" [class.text-green-600]="faq.isActive" [class.text-gray-500]="!faq.isActive">
                      {{ faq.isActive ? 'Active' : 'Inactive' }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button type="button" (click)="editFaq(faq)" class="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700">Edit</button>
                    <button type="button" (click)="deleteFaq(faq.id)" class="rounded border border-red-300 px-2 py-1 text-xs text-red-600">Delete</button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900 rtl:text-right">{{ 'ADMIN.SETTINGS.PLATFORM_CONFIGURATION.TITLE' | translate }}</h2>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.SETTINGS.PLATFORM_CONFIGURATION.DESCRIPTION' | translate }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900 rtl:text-right">{{ 'ADMIN.SETTINGS.JOB_CATEGORIES.TITLE' | translate }}</h2>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.SETTINGS.JOB_CATEGORIES.DESCRIPTION' | translate }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900 rtl:text-right">{{ 'ADMIN.SETTINGS.SKILL_LIBRARY.TITLE' | translate }}</h2>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.SETTINGS.SKILL_LIBRARY.DESCRIPTION' | translate }}</p>
      </div>
    </section>
  `,
})
export class AdminSettingsPageComponent implements OnInit {
  private readonly helpService = inject(HelpService);
  private readonly fb = inject(FormBuilder);

  readonly languageService = inject(LanguageService);
  readonly faqs = signal<FaqItem[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly editingId = signal<string | null>(null);

  readonly faqForm = this.fb.nonNullable.group({
    question: ['', [Validators.required]],
    answer: ['', [Validators.required]],
    isActive: [true],
  });

  ngOnInit(): void {
    this.loadFaqs();
  }

  saveFaq(): void {
    if (this.faqForm.invalid) {
      this.faqForm.markAllAsTouched();
      return;
    }

    const payload: UpsertFaqRequest = this.faqForm.getRawValue();
    this.error.set('');
    this.saving.set(true);

    const request$ = this.editingId()
      ? this.helpService.updateFAQ(this.editingId()!, payload)
      : this.helpService.createFAQ(payload);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadFaqs();
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Failed to save FAQ.');
      },
    });
  }

  editFaq(faq: FaqItem): void {
    this.editingId.set(faq.id);
    this.faqForm.setValue({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.faqForm.reset({ question: '', answer: '', isActive: true });
  }

  deleteFaq(id: string): void {
    this.error.set('');
    this.helpService.deleteFAQ(id).subscribe({
      next: () => this.loadFaqs(),
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Failed to delete FAQ.');
      },
    });
  }

  private loadFaqs(): void {
    this.loading.set(true);
    this.helpService.getFAQs().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (items) => {
        this.faqs.set(items);
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Failed to load FAQs.');
      },
    });
  }
}
