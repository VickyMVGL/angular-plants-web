// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import db from '../../../db.json'; // importa tu db.json directamente (requiere setup de Vite para json)

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  constructor() {
    // Inicializamos userSubject solo si estamos en el navegador
    const savedUser = typeof localStorage !== 'undefined' 
      ? JSON.parse(localStorage.getItem('auth_user') || 'null') 
      : null;

    this.userSubject = new BehaviorSubject<User | null>(savedUser);
    this.user$ = this.userSubject.asObservable();
  }

  private saveUser(user: User | null) {
    if (typeof localStorage !== 'undefined') {
      if (user) localStorage.setItem('auth_user', JSON.stringify(user));
      else localStorage.removeItem('auth_user');
    }
    this.userSubject.next(user);
  }

  login(username: string, password: string): Observable<User> {
    // buscamos en db.json
    const users: User[] = (db as any).users || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return throwError(() => new Error('Credenciales incorrectas'));
    }

    // eliminamos password antes de guardar
    const safeUser: User = { id: user.id, username: user.username, name: user.name, role: user.role };
    
    // simulamos delay como si fuera backend
    return of(safeUser).pipe(
      delay(500),
      tap(u => this.saveUser(u))
    );
  }

  logout(): void {
    this.saveUser(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
