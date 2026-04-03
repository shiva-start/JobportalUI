import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FreelancerRequestService } from '../../core/services/freelancer-request.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-freelancer-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="text-2xl font-semibold text-slate-800">Request Freelancer</h1>
      <p class="text-slate-500 mt-2">Submit your requirement; Admin will review and assign.</p>

      <form (ngSubmit)="onSubmit()" [formGroup]="form" class="mt-6 space-y-4 bg-white p-6 rounded-xl border border-slate-100">
        <div>
          <label class="block text-sm font-medium text-slate-700">Project description</label>
          <textarea formControlName="description" rows="4" class="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Required skills (comma separated)</label>
          <input formControlName="skills" type="text" class="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Duration (optional)</label>
          <input formControlName="duration" type="text" placeholder="e.g. 3 months" class="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div class="flex items-center gap-3">
          <button type="submit" [disabled]="form.invalid || submitting" class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Submit Request</button>
          <a routerLink="/jobs" class="text-sm text-slate-500 hover:text-slate-700">Cancel</a>
        </div>
      </form>
    </div>
  `
})
export class FreelancerRequestComponent {
  private fb = inject(FormBuilder);
  private service = inject(FreelancerRequestService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  submitting = false;

  form = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(10)]],
    skills: ['', [Validators.required]],
    duration: ['']
  });

  onSubmit() {
    if (!this.auth.isAuthenticated()) {
      this.toast.error('Please sign in as an employer to request a freelancer.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.auth.isEmployer()) {
      this.toast.error('Only employers can request freelancers.');
      return;
    }

    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    const payload = {
      employerId: this.auth.currentUser()?.id || 'unknown',
      employerName: this.auth.currentUser()?.company || this.auth.currentUser()?.name || 'Employer',
      employerEmail: this.auth.currentUser()?.email || 'unknown',
      description: this.form.value.description,
      message: this.form.value.description,
      skills: (this.form.value.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      duration: this.form.value.duration || null
    } as any;

    setTimeout(() => {
      const req = this.service.create(payload);
      this.submitting = false;
      this.toast.success('Request submitted. Admin will review and assign a freelancer.');
      this.router.navigate(['/admin']);
    }, 600);
  }
}
