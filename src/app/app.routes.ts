import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Página principal (pública, accesible sin login)
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home),
  },

  // Página de login (pública)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.LoginComponent),
  },

  // Páginas protegidas (solo si está logueado)
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about').then((m) => m.AboutPage),
    canActivate: [authGuard],
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services').then((m) => m.ServicesPage),
    canActivate: [authGuard],
  },
  {
    path: 'price',
    loadComponent: () =>
      import('./pages/price/price').then((m) => m.PricePage),
    canActivate: [authGuard],
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('./pages/booking/booking').then((m) => m.BookingPage),
    canActivate: [authGuard],
  },

  // PÁGINAS DE ADMIN (solo administradores)
  {
    path: 'config',
    loadComponent: () =>
      import('./pages/config/config').then((m) => m.ConfigPage),
    canActivate: [authGuard, AdminGuard],
  },

  // Página de CV existente (mantener por compatibilidad)
  {
    path: 'cv',
    loadComponent: () =>
      import('./pages/cv/cv').then((m) => m.CvComponent),
    canActivate: [authGuard],
  },

  // Redirecciones
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];