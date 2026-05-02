import { Injectable, computed, signal } from '@angular/core';
import usersData from '../../mock-data/users.json';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly usersSignal = signal<User[]>(
    (usersData as User[]).map((user) => ({
      ...user,
      accountStatus: user.accountStatus ?? 'active',
    })),
  );

  readonly users = computed(() => this.usersSignal());

  getUserById(userId: string): User | null {
    return this.usersSignal().find((user) => user.id === userId) ?? null;
  }

  listUsers(): User[] {
    return this.usersSignal();
  }

  updateUser(userId: string, patch: Partial<User>): void {
    this.usersSignal.update((list) => list.map((user) => (user.id === userId ? { ...user, ...patch } : user)));
  }

  removeUser(userId: string): void {
    this.usersSignal.update((list) => list.filter((user) => user.id !== userId));
  }

  setFreelancerStatus(userId: string, isFreelancer: boolean): void {
    this.usersSignal.update((list) => list.map((user) => (user.id === userId ? { ...user, isFreelancer } : user)));
  }
}
