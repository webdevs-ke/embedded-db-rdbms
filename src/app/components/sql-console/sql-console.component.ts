import { Component, ViewChild, ElementRef, HostListener } from '@angular/core'
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
  @ViewChild('sqlInput') sqlInput!: ElementRef<HTMLTextAreaElement>

  sql = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })
  
  output: any
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

  focusInput () {
    this.sqlInput.nativeElement.focus()
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown (event: KeyboardEvent) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const ctrlKeyPressed = isMac ? event.metaKey : event.ctrlKey

    if (ctrlKeyPressed && event.key === 'Enter') {
      event.preventDefault()
      this.run()
    }

    if (ctrlKeyPressed && event.key.toLowerCase() === 'l') {
      event.preventDefault()
      this.clear()
    }

    if (ctrlKeyPressed && event.key.toLowerCase() === 'h') {
      event.preventDefault()
      this.toggleHistory()
    }

    if (!ctrlKeyPressed && event.key === '/') {
      event.preventDefault()
      this.focusInput()
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