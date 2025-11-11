// src/app/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user' | null;
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User>({
    id: 0,
    username: '',
    role: null,
    isLoggedIn: false
  });

  public currentUser = this.currentUserSignal.asReadonly();
  public isLoggedIn = computed(() => this.currentUser().isLoggedIn);
  public isAdmin = computed(() => this.currentUser().role === 'admin');

  login(username: string, password: string, role: 'admin' | 'user' = 'user'): boolean {
    // Tu lógica de autenticación aquí
    const user: User = {
      id: 1,
      username: username,
      role: role,
      isLoggedIn: true
    };
    
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }

  logout(): void {
    const user: User = {
      id: 0,
      username: '',
      role: null,
      isLoggedIn: false
    };
    
    this.currentUserSignal.set(user);
    localStorage.removeItem('currentUser');
  }

  initializeAuth(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSignal.set(JSON.parse(savedUser));
    }
  }
}