import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminDashboardService } from '../../core/services/admin-dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NavbarComponent],
  templateUrl: './admin-shell.component.html',
})
export class AdminShellComponent {
  readonly auth = inject(AuthService);
  readonly admin = inject(AdminDashboardService);

  readonly navItems = computed(() => [
    { label: 'Dashboard', route: '/admin/dashboard' },
    { label: 'Freelancer Requests', route: '/admin/requests' },
    { label: 'Users', route: '/admin/users' },
    { label: 'Jobs', route: '/admin/jobs' },
    { label: 'Reports', route: '/admin/reports' },
    { label: 'Settings', route: '/admin/settings' },
  ]);
}
