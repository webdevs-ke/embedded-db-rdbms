import { Injectable } from '@angular/core';
import { Table } from '../models/table.model';
import { Column } from '../models/column.model';
import { IndexedDbService } from './indexeddb.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private currentDB = 'default'
  private databases = new Set<string>()
  tables = new Map<string, Table>();

  constructor(private store: IndexedDbService) {
    this.init()
  }

  private async init() {
    await this.store.open()
    const saved = await this.store.loadTable('__databases__')

    if (saved) this.databases = new Set(saved)
    else {
      this.databases.add('default')
      await this.persistDatabases()
    }
    await this.useDatabase('default')
  }

  async useDatabase(name: string) {
    if (!this.databases.has(name)) {
      throw new Error(`Database ${name} does not exist`)
    }  
    this.currentDB = name
    this.tables.clear()
  }
  
  private async persistDatabases() {
    await this.store.saveTable('__databases__', [...this.databases])
  }

  async createDatabase(name: string) {
    if (this.databases.has(name)) return
  
    this.databases.add(name)
    await this.persistDatabases()
  }

  async listDatabases(): Promise<string[]> {
    console.log('Available Databases:', this.databases.size)
    return [...this.databases]
  }  
  
  async listTables(): Promise<string[]> {
    const prefix = `${this.currentDB}::`
    const tables: string[] = []
  
    await this.store.iterateKeys(key => {
      if (typeof key === 'string' && key.startsWith(prefix)) {
        tables.push(key.replace(prefix, ''))
      }
    })  
    return tables
  }
  
  async dropDatabase(name: string) {
    if (name === 'default') {
      throw new Error('Cannot drop default database')
    }  
    if (!this.databases.has(name)) return
  
    this.databases.delete(name)
    await this.persistDatabases()
  
    // delete all tables belonging to this DB
    await this.store.deleteByPrefix(`${name}::`)
  
    if (this.currentDB === name) {
      await this.useDatabase('default')
    }
  }
  
  async createTable(name: string, columns: Column[]) {
    console.log("Creating table", name, 'on DB', this.currentDB)
    const key = `${this.currentDB}::${name}`
    if (this.tables.has(name)) return
  
    const table = new Table(name, columns, [])
    const saved = await this.store.loadTable(key)
  
    if (saved) Object.assign(table, saved)
  
    this.tables.set(name, table)
    this.store.saveTable(key, this.tables.get(name))
  }
 
  async insert(tableName: string, row: any): Promise<Table> {
    const table = await this.table(tableName)
    table.insert(row)
    this.persist(tableName)
    return table
  }
  
  async update(tableName: string, where: any, set: any): Promise<Table> {
    const table = await this.table(tableName)
    table.update(where, set)
    this.persist(tableName)
    return table
  }
  
  async delete(tableName: string, where: any): Promise<Table> {
    const table = await this.table(tableName)
    table.delete(where)
    this.persist(tableName)
    return table
  }
 
  async select (tableName: string, where: any): Promise<Table> {
    const table = await this.table(tableName)
    table.select(where)
    return table
  }

  persist(name: string) {
    const key = `${this.currentDB}::${name}`
    this.store.saveTable(key, this.tables.get(name))
  }
  
  async table(name: string): Promise<Table> {
    let table = this.tables.get(name)
  
    if (!table) {
      table = await this.loadTable(name)
    }  
    return table
  }
  
  async loadTable(name: string): Promise<Table> {
    const key = `${this.currentDB}::${name}`
  
    const saved = await this.store.loadTable(key)
    if (!saved) {
      throw new Error(`Table ${name} does not exist`)
    }
  
    const table = new Table(
      saved.name,
      saved.columns,
      saved.rows ?? []
    )
  
    this.tables.set(name, table)
    return table
  }
}