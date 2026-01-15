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
    const key = `${this.currentDB}::${name}`
    if (this.tables.has(name)) return
  
    const table = new Table(name, columns)
    const saved = await this.store.loadTable(key)
  
    if (saved) Object.assign(table, saved)
  
    this.tables.set(name, table)
  }
    
  persist(name: string) {
    const key = `${this.currentDB}::${name}`
    this.store.saveTable(key, this.tables.get(name))
  }
  
  
  table(name: string): Table {
    const t = this.tables.get(name);
    if (!t) throw new Error('Table not found');
    return t;
  }
}