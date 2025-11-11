// src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Iniciar Sesión</h3>
            </div>
            <div class="card-body">
              <form (ngSubmit)="login()">
                <div class="mb-3">
                  <label class="form-label">Usuario:</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="username" 
                    name="username" 
                    required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña:</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    [(ngModel)]="password" 
                    name="password" 
                    required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Tipo de usuario:</label>
                  <select class="form-select" [(ngModel)]="role" name="role">
                    <option value="user">Usuario Normal</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary w-100">Ingresar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  role: 'admin' | 'user' = 'user';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.authService.login(this.username, this.password, this.role)) {
      // Redirigir según el tipo de usuario
      if (this.role === 'admin') {
        this.router.navigate(['/ver-cv']);
      } else {
        this.router.navigate(['/crear-cv']);
      }
    }
  }
}