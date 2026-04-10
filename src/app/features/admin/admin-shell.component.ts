import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminDashboardService } from '../../core/services/admin-dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe, NavbarComponent],
  templateUrl: './admin-shell.component.html',
})
export class AdminShellComponent {
  readonly auth = inject(AuthService);
  readonly admin = inject(AdminDashboardService);

  readonly navItems = computed(() => [
    { labelKey: 'ADMIN.NAV.DASHBOARD', route: '/admin/dashboard' },
    { labelKey: 'ADMIN.NAV.REQUESTS', route: '/admin/requests' },
    { labelKey: 'ADMIN.NAV.USERS', route: '/admin/users' },
    { labelKey: 'ADMIN.NAV.JOBS', route: '/admin/jobs' },
    { labelKey: 'ADMIN.NAV.REPORTS', route: '/admin/reports' },
    { labelKey: 'ADMIN.NAV.SETTINGS', route: '/admin/settings' },
  ]);
}
