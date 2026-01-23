import { Routes } from '@angular/router'
import { SqlConsoleComponent } from './components/sql-console/sql-console.component'
import { AuthComponent } from './demo-library-app/auth/auth.component'
import { libAppGuard } from './guards/lib-app-guard'
import { BooksComponent } from './demo-library-app/books/books.component'
import { AboutComponent } from './components/about/about.component'

export const routes: Routes = [
  {
    path: '',
    component: SqlConsoleComponent,
  },

  {
    path: 'about/:topic',
    component: AboutComponent,
  },

  {
    path: 'demo',
    component: AuthComponent,
  },

  {
    path: 'books',
    component: BooksComponent,
    canActivate: [libAppGuard],    
  },

  {
    path: '**',
    redirectTo: '',
  },
]
