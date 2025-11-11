import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const userRaw = localStorage.getItem('auth_user') || localStorage.getItem('user');
  if (!userRaw) {
    return router.parseUrl('/login');
  }

  try {
    const parsedUser = JSON.parse(userRaw);
    if (parsedUser?.role === 'admin') {
      return true;
    } else {
      return router.parseUrl('/home');
    }
  } catch (error) {
    return router.parseUrl('/login');
  }
};
