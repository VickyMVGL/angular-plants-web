// src/app/navbar/navbar.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid p-0">
      <nav class="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-lg-5">
        <a routerLink="/" class="navbar-brand d-block d-lg-none" (click)="closeMenu()">
          <h1 class="m-0 display-5 text-capitalize font-italic text-white">
            <span class="text-primary">Safety</span>First
          </h1>
        </a>

        <button class="navbar-toggler" type="button" (click)="toggleMenu()" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" [class.show]="menuOpen()">
          <div class="navbar-nav mr-auto py-0">
            <a routerLink="/" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">Home</a>
            <a routerLink="/about" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">About</a>
            <a routerLink="/services" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">Service</a>
            <a routerLink="/price" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">Price</a>
            <a routerLink="/booking" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">Booking</a>
          </div>

          <!-- Login / Usuario -->
          <div class="d-none d-lg-block">
            <!-- Botón Log In si no hay usuario -->
            <button *ngIf="!userSignal()" class="btn btn-lg btn-secondary px-3" (click)="goLogin()">
              Log In
            </button>

            <!-- Usuario logueado -->
            <div *ngIf="userSignal()" class="btn-group">
              <button class="btn btn-lg btn-success dropdown-toggle" type="button" (click)="toggleDropdown($event)">
                {{ userSignal()?.name }}
              </button>

              <ul class="dropdown-menu dropdown-menu-end" [class.show]="dropdownOpen()">
                <!-- Opciones admin -->
                <li *ngIf="userSignal()?.role === 'admin'">
                  <a class="dropdown-item" routerLink="/ver-cv" (click)="closeMenu()">Ver CV</a>
                </li>
                <li *ngIf="userSignal()?.role === 'admin'">
                  <a class="dropdown-item" routerLink="/paleta-colores" (click)="closeMenu()">Paleta de colores</a>
                </li>

                <!-- Opciones user -->
                <li *ngIf="userSignal()?.role === 'user'">
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
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .navbar-nav .nav-link.active {
        color: #fff;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 4px;
      }
      .dropdown-menu { position: absolute; }
      @media (max-width: 991px) {
        .dropdown-menu { position: static; }
      }
    `,
  ],
})
export class Navbar {
  menuOpen = signal(false);
  dropdownOpen = signal(false);
  userSignal = signal<User | null>(null);

  constructor(private auth: AuthService, private router: Router) {
    // Suscribirse al user$ y actualizar el signal
    this.auth.user$.subscribe(user => {
      console.log('Navbar: usuario actualizado', user);
      this.userSignal.set(user);
    });
  }

  toggleMenu() { 
    this.menuOpen.set(!this.menuOpen()); 
    if (!this.menuOpen()) this.dropdownOpen.set(false); 
  }

  closeMenu() { 
    this.menuOpen.set(false); 
    this.dropdownOpen.set(false); 
  }

  onNavClick() { 
    this.closeMenu(); 
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
