// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.apiBase;
  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private loadUser(): User | null {
    const raw = localStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as User) : null;
  }

  private saveUser(user: User | null) {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
    this.userSubject.next(user);
  }

  /**
   * Intenta loguear con username/password contra json-server: GET /users?username=...&password=...
   * Devuelve Observable<User> que emite el usuario logueado y lo guarda en localStorage.
   */
  login(username: string, password: string): Observable<User> {
    const url = `${this.api}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    return this.http.get<User[]>(url).pipe(
      map(users => {
        if (!users || users.length === 0) {
          throw new Error('Credenciales incorrectas');
        }
        const u = users[0];
        // construir usuario sin password
        return { id: u.id, username: u.username, name: u.name, role: u.role } as User;
      }),
      tap(user => this.saveUser(user)), // side-effect: guarda usuario
      catchError(err => {
        const message = err?.message ?? 'Error de red';
        return throwError(() => new Error(message));
      })
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
