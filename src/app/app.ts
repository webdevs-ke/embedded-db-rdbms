// ================================
// ANGULAR-ONLY EMBEDDED RDBMS
// ================================
// This is a client-side database engine implemented in TypeScript.
// It is designed for Angular applications - offline-first, single-user, scalable.

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SqlConsoleComponent } from './components/sql-console/sql-console.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SqlConsoleComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Embed-RDBMS')
}
