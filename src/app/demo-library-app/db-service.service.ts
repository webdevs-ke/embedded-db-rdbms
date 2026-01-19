import { Injectable } from '@angular/core';
import { SqlEngineService } from '../services/sql-engine.service'

@Injectable({
  providedIn: 'root',
})
export class LibraryDBService {

  currentUser: any = null

  constructor(private sql: SqlEngineService) {}

  async registerUser(user: any) {
    return this.sql.execute(
      `INSERT INTO users VALUES (${user.id}, '${user.name}', '${user.email}', '${user.phone}')`
    )
  }

  async login(email: string, phone: string) {
    const rows = await this.sql.execute(
      `SELECT * FROM users WHERE email = '${email}'`
    )
    const user = rows.find((u: any) => u.phone === phone)
    if (!user) throw new Error('Invalid credentials')

    this.currentUser = user
    return user
  }

  async addBook(title: string, type: number) {
    if (!this.currentUser) throw new Error('Not logged in')

    const id = Date.now()
    return this.sql.execute(
      `INSERT INTO books VALUES (${id}, '${title}', ${type}, ${this.currentUser.id})`
    )
  }

  async myBooks() {
    return this.sql.execute(
      `SELECT * FROM books WHERE user_id = ${this.currentUser.id}`
    )
  }
}