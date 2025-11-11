import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AdminGuard: CanActivateFn = (route, state) => {
  const router = new Router();

  const user = localStorage.getItem('user');
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const parsedUser = JSON.parse(user);
    if (parsedUser.role === 'admin') {
      return true;
    } else {
      router.navigate(['/home']);
      return false;
    }
  } catch (error) {
    router.navigate(['/login']);
    return false;
  }
};
