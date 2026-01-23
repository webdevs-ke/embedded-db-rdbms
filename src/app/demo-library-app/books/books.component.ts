import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms'
import { LibraryDBService } from '../db-service.service'

@Component({
  selector: 'app-books',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit {

  title = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })
  type = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  })

  books: any[] = []
  bookTypes: any[] = []

  constructor(public db: LibraryDBService) {}

  async ngOnInit() {
    if (this.db.currentUser) {
      this.bookTypes = await this.db.bookTypes()
      this.books = await this.db.myBooks()
      this.mapBookTypes()
           
    }    
  }

  async addBook() {
    await this.db.addBook(this.title.value, Number(this.type.value))
    this.books = await this.db.myBooks()
    this.mapBookTypes()
    // this.title.vale = ''
  }

  private mapBookTypes () {
    const typeMap = new Map<number, string>(
      this.bookTypes.map(t => [t.id, t.type])
    )
    this.books = this.books.map(b => ({
      ...b,
      typeName: typeMap.get(b.typeID) ?? 'Unknown'
    }))
  }
}