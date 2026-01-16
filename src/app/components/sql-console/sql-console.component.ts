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

  constructor(private engine: SqlEngineService) {}

  async run() {
    try {
    this.output = await this.engine.execute(this.sql.value)
    } catch (e: any) {
      this.output = {error: e.message}
    }
  }
}
