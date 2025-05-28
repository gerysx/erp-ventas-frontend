import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard = (rolesPermitidos: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const rol = auth.obtenerRol();
    if (!rol) {
      return router.createUrlTree(['/']);
    }

    const normalizado = rol.toUpperCase();
    const permitidos = rolesPermitidos.map(r => r.toUpperCase());

    if (permitidos.includes(normalizado)) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
};
