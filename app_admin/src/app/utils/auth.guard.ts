import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

// Send anyone who is not logged in to the login page
export const authGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
