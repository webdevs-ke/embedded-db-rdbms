import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { LibraryDBService } from '../demo-library-app/db-service.service'

export const libAppGuard: CanActivateFn = (route, state) => {
  const db = inject(LibraryDBService)
  const router = inject(Router)

  // not logged in, redirect to auth page
  if (!db.currentUser) {
    router.parseUrl('/demo')
    return false
  }
  return true;
}