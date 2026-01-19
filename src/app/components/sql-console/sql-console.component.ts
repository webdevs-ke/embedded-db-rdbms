import { Component } from '@angular/core'
import { JsonPipe, KeyValuePipe } from '@angular/common'
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms'
import { SqlEngineService } from '../../services/sql-engine.service'

@Component({
  selector: 'app-sql-console',
  imports: [JsonPipe, KeyValuePipe, ReactiveFormsModule],
  templateUrl: './sql-console.component.html',
  styleUrl: './sql-console.component.css',
})
export class SqlConsoleComponent {
  sql = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })
  
  output: any
  isOutput: boolean = false

  history: string[] = []
  showHistory = false

  constructor(private engine: SqlEngineService) {}

  async run() {
    const query = this.sql.value.trim()
    if (!query) return

    try {
      this.output = await this.engine.execute(query)
      if (this.history[this.history.length - 1] !== query) {
        this.history.unshift(query)
      }
      this.showHistory = false
    } catch (e: any) {
      this.output = {error: e.message}
    }
  }

  clear () {
    this.sql.reset('')
    // this.output = null
    this.showHistory = false
  }

  toggleHistory () {
    this.showHistory = !this.showHistory
  }

  loadFromHistory (query: string) {
    this.sql.setValue(query)
    this.showHistory = false
  }
}
