import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900">Platform Configuration</h2>
        <p class="mt-2 text-sm text-gray-500">Manage platform behavior, approvals, and operational controls.</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900">Job Categories</h2>
        <p class="mt-2 text-sm text-gray-500">Category and taxonomy management placeholder.</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900">Skill Library</h2>
        <p class="mt-2 text-sm text-gray-500">Centralized skill management placeholder.</p>
      </div>
    </section>
  `,
})
export class AdminSettingsPageComponent {}
