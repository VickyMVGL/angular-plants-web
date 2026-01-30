import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'loader',
    pathMatch: 'full',
  },
  {
    path: 'loader',
    loadComponent: () => import('./components/loader/loader').then((m) => m.LoaderComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then((m) => m.ServicesPage),
  },
  {
    path: 'price',
    loadComponent: () => import('./pages/price/price').then((m) => m.PricePage),
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking').then((m) => m.BookingPage),
  },
  {
    path: 'config',
    loadComponent: () => import('./pages/config/config').then((m) => m.ConfigPage),
  },
  {
    path: 'cv',
    loadComponent: () => import('./pages/cv/cv').then((m) => m.CvComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
