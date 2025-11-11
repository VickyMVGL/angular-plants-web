// src/app/navbar/navbar.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-3">
      <a routerLink="/" class="navbar-brand">Mi App</a>

      <button class="navbar-toggler" type="button" (click)="toggleMenu()">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" [class.show]="menuOpen()">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a routerLink="/" class="nav-link" (click)="closeMenu()">Home</a></li>
          <li class="nav-item"><a routerLink="/about" class="nav-link" (click)="closeMenu()">About</a></li>
          <li class="nav-item"><a routerLink="/services" class="nav-link" (click)="closeMenu()">Service</a></li>
        </ul>

        <div class="d-flex">
          <!-- Si no hay usuario -->
          <button *ngIf="!auth.currentUser()" class="btn btn-secondary me-2" (click)="goLogin()">
            Log In
          </button>

          <!-- Si hay usuario -->
          <div *ngIf="auth.currentUser()" class="btn-group">
            <button class="btn btn-success dropdown-toggle" type="button" (click)="toggleDropdown($event)">
              {{ auth.currentUser()?.username }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end" [class.show]="dropdownOpen()">
              <li *ngIf="auth.isAdmin()">
                <a class="dropdown-item" routerLink="/ver-cv" (click)="closeMenu()">Ver CV</a>
              </li>
              <li *ngIf="auth.isAdmin()">
                <a class="dropdown-item" routerLink="/paleta-colores" (click)="closeMenu()">Paleta de colores</a>
              </li>
              <li *ngIf="!auth.isAdmin()">
                <a class="dropdown-item" routerLink="/crear-cv" (click)="closeMenu()">Crear CV</a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item" (click)="logout()">Cerrar sesión</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class Navbar {
  menuOpen = signal(false);
  dropdownOpen = signal(false);

  constructor(public auth: AuthService, private router: Router) {}

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
    if (!this.menuOpen()) this.dropdownOpen.set(false);
  }

  closeMenu() {
    this.menuOpen.set(false);
    this.dropdownOpen.set(false);
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  goLogin() {
    this.router.navigateByUrl('/login');
    this.closeMenu();
  }

  logout() {
    this.auth.logout();
    this.closeMenu();
    this.router.navigateByUrl('/');
  }
}
