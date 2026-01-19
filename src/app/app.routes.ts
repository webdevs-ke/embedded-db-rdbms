import { Routes } from '@angular/router'
import { SqlConsoleComponent } from './components/sql-console/sql-console.component'
import { AuthComponent } from './demo-library-app/auth/auth.component'
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
        path: '**',
        redirectTo: '',
    },
]
