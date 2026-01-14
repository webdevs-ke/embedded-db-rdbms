import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { SqlEngineService } from '../../services/sql-engine.service';

@Component({
  selector: 'app-sql-console',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './sql-console.component.html',
  styleUrl: './sql-console.component.css',
})
export class SqlConsoleComponent {
  sql = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  });
  
  output: any;

  constructor(private engine: SqlEngineService) {}

  run() {
    console.log("Beginning code execution");
    try {
      this.output = this.engine.execute(this.sql.value);
    } catch (e: any) {
      this.output = e.message;
    }
  }
}
