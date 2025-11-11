import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage),
    canActivate: [AuthGuard],  // Opcional: protege si es para users logueados
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then((m) => m.ServicesPage),
    canActivate: [AuthGuard],  // Opcional
  },
  {
    path: 'price',
    loadComponent: () => import('./pages/price/price').then((m) => m.PricePage),
    canActivate: [AuthGuard],  // Opcional
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking').then((m) => m.BookingPage),
    canActivate: [AuthGuard],  // Opcional
  },
  {
    path: 'config',
    loadComponent: () => import('./pages/config/config').then((m) => m.ConfigPage),
    canActivate: [AuthGuard, AdminGuard],  // Ejemplo: solo para admins
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'  // O a una página 404 si la tienes
  }
];