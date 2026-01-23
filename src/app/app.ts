import { Component, signal } from '@angular/core'
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'

interface PillLink {
  title: string
  route?: string
  external?: string
  pillColor?: string
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  pillColor = 'currentColor'

  pills: PillLink[] = [
    { title: 'Home - SQL Console', route: '/', pillColor: 'currentColor' },
    { title: 'About ngDB RDBMS', route: '/about/ngdb', pillColor: 'currentColor' },
    { title: 'Help with SQL Commands', route: '/about/sql-help', pillColor: 'currentColor' },
    { title: 'About IndexedDB', route: '/about/indexeddb', pillColor: 'currentColor' },
    { title: 'About Angular', route: '/about/angular', pillColor: 'currentColor' },
    { title: 'About Author', external: 'https://benkatiku.netlify.app', pillColor: '#000' },
    { title: 'Demo Library PWA', route: '/demo', pillColor: 'currentColor' },    
  ]

  protected readonly title = signal('Embed-RDBMS')
}