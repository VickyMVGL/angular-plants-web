// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import db from '../../../db.json';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  constructor() {
    console.log('AuthService constructor ejecutado');

    // Inicializar desde localStorage solo si estamos en navegador
    const savedUser =
      typeof window !== 'undefined' && localStorage
        ? JSON.parse(localStorage.getItem('auth_user') || 'null')
        : null;

    console.log('Usuario cargado desde localStorage:', savedUser);

    this.userSubject = new BehaviorSubject<User | null>(savedUser);
    this.user$ = this.userSubject.asObservable();

    console.log('db.json importado:', db);
  }

  private saveUser(user: User | null) {
    console.log('saveUser llamado con:', user);

    if (typeof window !== 'undefined' && localStorage) {
      if (user) localStorage.setItem('auth_user', JSON.stringify(user));
      else localStorage.removeItem('auth_user');
    }

    this.userSubject.next(user);
  }

  /**
   * Login simulado usando db.json
   */
  login(username: string, password: string): Observable<User> {
    console.log('login llamado con:', { username, password });

    try {
      const users: User[] = (db as any)?.users || [];
      console.log('Usuarios disponibles en db.json:', users);

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        console.warn('Credenciales incorrectas para:', username);
        return throwError(() => new Error('Credenciales incorrectas'));
      }

      // eliminamos password antes de guardar
      const safeUser: User = {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      };

      console.log('Usuario encontrado y seguro para guardar:', safeUser);

      return of(safeUser).pipe(
        delay(300), // simulamos request a backend
        tap((u) => {
          console.log('tap en login, guardando usuario:', u);
          this.saveUser(u);
        })
      );
    } catch (err: any) {
      console.error('Error en login:', err);
      return throwError(() => new Error(err?.message ?? 'Error inesperado'));
    }
  }

  logout(): void {
    console.log('logout llamado');
    this.saveUser(null);
  }

  get currentUser(): User | null {
    console.log('currentUser solicitado:', this.userSubject.value);
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    const auth = !!this.userSubject.value;
    console.log('isAuthenticated:', auth);
    return auth;
  }
}
