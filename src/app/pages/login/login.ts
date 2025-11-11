// src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Quitar HttpClientModule
  template: `
    <div class="login-container">
      <h2>Iniciar sesión</h2>
      <form #f="ngForm" (ngSubmit)="onSubmit(f)">
        <div>
          <label>Usuario</label>
          <input
            name="username"
            [(ngModel)]="username"
            required
            class="w-full border p-2"
          />
        </div>

        <div class="mt-2">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            [(ngModel)]="password"
            required
            class="w-full border p-2"
          />
        </div>

        <div *ngIf="error" class="text-red-600 mt-2">{{ error }}</div>

        <button
          type="submit"
          [disabled]="loading"
          class="mt-4 px-4 py-2 bg-blue-600 text-white"
        >
          {{ loading ? 'Cargando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.error = 'Por favor, complete todos los campos.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/home'); // navega a /home
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message ?? 'Credenciales incorrectas';
      }
    });
  }
}
