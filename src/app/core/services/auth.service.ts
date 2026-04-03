import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../models';
import usersData from '../../mock-data/users.json';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(null);
  private readonly _users = signal<User[]>(
    (usersData as User[]).map(user => ({
      ...user,
      accountStatus: user.accountStatus ?? 'active',
    })),
  );

  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isCandidate = computed(() => this._currentUser()?.role === 'candidate');
  readonly isEmployer = computed(() => this._currentUser()?.role === 'employer');
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly isFreelancer = computed(() => this._currentUser()?.isFreelancer === true);
  readonly users = computed(() => this._users());

  login(email: string, _password: string): boolean {
    const user = this._users().find(u => u.email === email);
    if (user) {
      this._currentUser.set(user);
      return true;
    }
    // Demo: auto-create candidate session
    const demoUser: User = {
      id: 'demo',
      name: 'Demo User',
      email,
      role: 'candidate',
      avatar: email.charAt(0).toUpperCase()
    };
    this._currentUser.set(demoUser);
    return true;
  }

  loginAsEmployer(): void {
    this._currentUser.set(this._users().find(u => u.role === 'employer') || null);
  }

  loginAsCandidate(): void {
    this._currentUser.set(this._users().find(u => u.role === 'candidate') || null);
  }

  loginAsAdmin(): void {
    // Create or pick an admin user from the mock list; if not present, inject a demo admin
    const admin = this._users().find(u => u.role === 'admin') || { id: 'admin', name: 'Site Admin', email: 'admin@example.com', role: 'admin', avatar: 'AD' };
    this._currentUser.set(admin as User);
  }

  setFreelancerStatus(userId: string, isFreelancer: boolean) {
    // update users list
    this._users.update(list => list.map(u => u.id === userId ? { ...u, isFreelancer } : u));
    // if current user is the same, update currentUser
    if (this._currentUser()?.id === userId) {
      const u = { ...(this._currentUser() as User), isFreelancer } as User;
      this._currentUser.set(u);
    }
  }

  getUserById(userId: string) {
    return this._users().find(u => u.id === userId) || null;
  }

  listUsers(): User[] {
    return this._users();
  }

  updateUser(userId: string, patch: Partial<User>): void {
    this._users.update(list => list.map(user => user.id === userId ? { ...user, ...patch } : user));
    if (this._currentUser()?.id === userId) {
      this._currentUser.set({ ...(this._currentUser() as User), ...patch });
    }
  }

  removeUser(userId: string): void {
    this._users.update(list => list.filter(user => user.id !== userId));
    if (this._currentUser()?.id === userId) {
      this._currentUser.set(null);
    }
  }

  register(name: string, email: string, role: 'candidate' | 'employer'): boolean {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: name.charAt(0).toUpperCase()
    };
    this._users.update(users => [...users, newUser]);
    this._currentUser.set(newUser);
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getUserRole(): User['role'] | null {
    return this._currentUser()?.role ?? null;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
