import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Página de login (pública)
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },

  // Página principal (solo usuarios logueados)
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home),
    canActivate: [AuthGuard],
  },
  // Páginas protegidas (solo si está logueado)
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about').then((m) => m.AboutPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services').then((m) => m.ServicesPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'price',
    loadComponent: () =>
      import('./pages/price/price').then((m) => m.PricePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('./pages/booking/booking').then((m) => m.BookingPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./pages/config/config').then((m) => m.ConfigPage),
    canActivate: [AuthGuard, AdminGuard], // Solo admins
  },

  // Página de CV (para usuarios normales)
  {
    path: 'cv',
    loadComponent: () =>
      import('./pages/cv/cv').then((m) => m.CvComponent),
    canActivate: [AuthGuard],
  },

  // Redirecciones
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
