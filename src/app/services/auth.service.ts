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

  constructor() {
    // ✅ Inicializa el usuario si hay datos guardados
    this.initializeAuth();
  }

  login(username: string, password: string, role: 'admin' | 'user' = 'user'): boolean {
    const user: User = {
      id: 1,
      username,
      role,
      isLoggedIn: true
    };
    
    this.currentUserSignal.set(user);

    // ✅ Guardar solo si estamos en navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }

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

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
  }

  initializeAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          this.currentUserSignal.set(parsed);
        } catch {
          console.warn('Error al parsear el usuario guardado.');
        }
      }
    }
  }
}
