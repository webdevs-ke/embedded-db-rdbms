import { Component, OnInit } from '@angular/core'
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms'
import { LibraryDBService } from '../db-service.service'

@Component({
  selector: 'app-books',
  imports: [ReactiveFormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
@Component({
  selector: 'app-books',
  templateUrl: './books.component.html'
})
export class BooksComponent implements OnInit {

  title = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })
  type = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })

  books: any[] = []

  constructor(public db: LibraryDBService) {}

  async ngOnInit() {
    if (this.db.currentUser) {
      this.books = await this.db.myBooks()
    }
  }

  async addBook() {
    await this.db.addBook(this.title.value, Number(this.type.value))
    this.books = await this.db.myBooks()
    // this.title.value = ''
  }
}