import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const required = route.data?.['role'] as string | undefined;
    const user = this.auth.currentUser();
    if (!required) return true;
    if (!user || user.role !== required) {
      // If user is authenticated but wrong role, redirect to home
      return this.router.parseUrl('/');
    }
    return true;
  }
}
