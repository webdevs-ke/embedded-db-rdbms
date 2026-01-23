import { Injectable } from '@angular/core';
import { SqlEngineService } from '../services/sql-engine.service'

@Injectable({
  providedIn: 'root',
})
export class LibraryDBService {

  private initialized = false
  currentUser: any = null

  constructor(private sql: SqlEngineService) {}

  /* ---------- PUBLIC API ---------- */

  async registerUser(user: any) {
    await this.init()

    this.validateUser(user)

    return this.sql.execute(
      `INSERT INTO users VALUES (${user.id}, '${user.name}', '${user.email}', '${user.phone}')`
    )
  }

  async login(email: string, phone: string) {
    const sql = `SELECT * FROM users WHERE email = '${email}'`
    await this.init()
    const rows = await this.sql.execute(`SELECT * FROM users WHERE email = '${email}'`)

    const user = rows.rows.find((u: any) => u.phone === phone)
    if (!user) throw new Error('Invalid credentials')

    this.currentUser = user
    return user
  }

  async addBook(title: string, typeID: number) {
    await this.init()

    if (!this.currentUser) throw new Error('Not logged in')

    const id = Date.now()
    return this.sql.execute(
      `INSERT INTO books VALUES (${id}, '${title}', NULL, ${typeID}, ${this.currentUser.id})`
    )
  }

  async myBooks() {
    await this.init()
    const books = await this.sql.execute(`SELECT * FROM books WHERE userID = ${this.currentUser.id}`)
    return books.rows
  }

  async bookTypes() {
    await this.init()
    const bookTypes = await this.sql.execute(`SELECT * FROM book_types`)
    return bookTypes.rows
  }
  /* ---------- INIT ---------- */
  private async init() {
    if (this.initialized) return

    // create + use database
    const dbs = await this.sql.execute('SHOW DATABASES')
    if (!dbs.includes('library')) {
      await this.sql.execute('CREATE DATABASE library')
    }

    await this.sql.execute('USE library')

    // ensure tables
    const tablesResp = await this.sql.execute('SHOW TABLES')
    const tables = tablesResp.tables

    if (!tables.includes('users')) {
      await this.createUsersTable()
    }

    if (!tables.includes('book_types')) {
      await this.createBookTypesTable()
    }

    if (!tables.includes('books')) {
      await this.createBooksTable()
    }

    this.initialized = true
  }

  private async createUsersTable() {
    await this.sql.execute(`CREATE TABLE users (id INT PRIMARY, name TEXT, email TEXT UNIQUE, phone TEXT UNIQUE)`)
  }

  private async createBookTypesTable() {
    await this.sql.execute(`CREATE TABLE book_types (id INT PRIMARY, type TEXT UNIQUE)`)

    await this.sql.execute(`INSERT INTO book_types VALUES (1, Fiction)`)
    await this.sql.execute(`INSERT INTO book_types VALUES (2, Non-Fiction)`)
  }

  private async createBooksTable() {
    await this.sql.execute(`CREATE TABLE books (id INT PRIMARY, title TEXT UNIQUE, file BLOB, typeID INT, userID INT)`)
  }

  private validateUser(user: any) {
    if (typeof user.id !== 'number') {
      throw new Error('User id must be a number')
    }

    if (typeof user.name !== 'string' || user.name.length < 5) {
      throw new Error('Name must be a valid string')
    }

    if (!this.isValidEmail(user.email)) {
      throw new Error('Invalid email format')
    }

    if (!(/^\d+$/.test(user.phone)) || user.phone.length !== 10) {
      throw new Error('Phone must be a number of 10 digits')
    }
  }

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}