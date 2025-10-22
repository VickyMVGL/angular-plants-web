import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

      <!-- burger button para móvil -->
      <button class="navbar-toggler" type="button" (click)="toggleMenu()" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- nav (controlamos la clase 'show' con menuOpen) -->
      <div class="collapse navbar-collapse" [class.show]="menuOpen" id="navbarCollapse">
        <div class="navbar-nav mr-auto py-0">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
             class="nav-item nav-link" (click)="onNavClick()">Home</a>

          <a routerLink="/about" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">About</a>

          <a routerLink="/services" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">Service</a>

          <a routerLink="/price" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">Price</a>

          <a routerLink="/booking" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">Booking</a>

          <a routerLink="/contact" routerLinkActive="active" class="nav-item nav-link" (click)="onNavClick()">Contact</a>
        </div>

        <a routerLink="/login" class="btn btn-lg btn-primary px-3 d-none d-lg-block" (click)="closeMenu()">Log In</a>
      </div>
    </nav>
  </div>
  `,
  styles: [`
    :host { display:block; }
    /* Mantengo estilos mínimos; usa tus clases globales o Bootstrap */
    .navbar-nav .nav-link.active { color: #fff; background: rgba(255,255,255,0.06); border-radius: 4px; }
    .dropdown-menu { position: absolute; }
    @media (max-width: 991px) {
      .dropdown-menu { position: static; }
    }
  `]
})
export class Navbar {
  menuOpen = false;
  dropdownOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    // cerrar dropdown si cerramos el menu
    if (!this.menuOpen) this.dropdownOpen = false;
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.dropdownOpen = false;
  }

  onNavClick(): void {
    // cuando el usuario hace click en un link, cerramos el menú (móvil)
    this.closeMenu();
  }

  toggleDropdown(event: Event): void {
    // prevenir navegación inesperada y togglear manualmente
    event.preventDefault();
    this.dropdownOpen = !this.dropdownOpen;
  }
}
