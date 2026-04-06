import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HelpService } from '../../services/help.service';
import { SupportTicket } from '../../../../../models';

@Component({
  selector: 'app-support-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-card">
      <h3 class="text-xl font-bold text-slate-900 mb-1">Contact Support</h3>
      <p class="text-sm text-slate-500 mb-6">We typically respond within 24 hours.</p>

      @if (submitted()) {
        <div class="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
          <div class="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h4 class="text-base font-semibold text-slate-800 mb-1">Message sent!</h4>
          <p class="text-sm text-slate-500">Our team will get back to you at <strong>{{ form.email }}</strong> within 24 hours.</p>
          <button (click)="reset()" class="mt-5 text-sm text-blue-600 hover:text-blue-700 font-medium">Send another message</button>
        </div>
      } @else {
        <form (ngSubmit)="submit()" #f="ngForm" class="space-y-4">
          <!-- Name + Email -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
              <input type="text" name="name" [(ngModel)]="form.name" required
                placeholder="John Doe"
                class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"/>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">Email Address *</label>
              <input type="email" name="email" [(ngModel)]="form.email" required
                placeholder="you@example.com"
                class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"/>
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">Category *</label>
            <select name="category" [(ngModel)]="form.category" required
              class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-slate-700">
              <option value="" disabled>Select a category</option>
              <option value="Account">Account</option>
              <option value="Jobs">Jobs & Applications</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">Subject *</label>
            <input type="text" name="subject" [(ngModel)]="form.subject" required
              placeholder="Brief description of your issue"
              class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"/>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">Message *</label>
            <textarea name="message" [(ngModel)]="form.message" required rows="5"
              placeholder="Describe your issue in detail..."
              class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 resize-none"></textarea>
          </div>

          <button
            type="submit"
            [disabled]="f.invalid || loading()"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            @if (loading()) {
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Sending...
            } @else {
              Send Message
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            }
          </button>
        </form>
      }
    </div>
  `
})
export class SupportFormComponent {
  private helpService = inject(HelpService);

  loading = signal(false);
  submitted = signal(false);

  form: SupportTicket = { name: '', email: '', subject: '', message: '', category: '' };

  async submit(): Promise<void> {
    this.loading.set(true);
    await this.helpService.submitTicket(this.form);
    this.loading.set(false);
    this.submitted.set(true);
  }

  reset(): void {
    this.submitted.set(false);
    this.form = { name: '', email: '', subject: '', message: '', category: '' };
  }
}
