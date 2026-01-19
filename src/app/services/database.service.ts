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
    const key = `${this.currentDB}::${name}`
    if (this.tables.has(name)) return
  
    const table = new Table(name, columns, [])
    const saved = await this.store.loadTable(key)
  
    if (saved) Object.assign(table, saved)
  
    this.tables.set(name, table)  // insert into memory
    await this.store.saveTable(key, this.tables.get(name))  // insert into IndexedDB (from memory)
  }
 
  async dropTable(tableName: string): Promise<void> {
    const key = `${this.currentDB}::${tableName}`
    const exists = await this.store.tableExists(key)
  
    if (!exists) {
      throw new Error(`Table ${tableName} does not exist`)
    }
    await this.store.deleteTable(key)  // remove from IndexedDB
    this.tables.delete(tableName)  // remove from memory
  }

  async renameTable(oldName: string, newName: string): Promise<Table> {
    if (this.tables.has(newName)) {
      throw new Error('Target table already exists')
    }  
    const oldKey = `${this.currentDB}::${oldName}`
    const newKey = `${this.currentDB}::${newName}`  
    const table = await this.table(oldName)  
    table.name = newName  // update table object  
    await this.store.saveTable(newKey, table)  // persist under new key    
    await this.store.deleteByPrefix(oldKey)  // remove old key
    this.tables.delete(oldName)  // update in-memory map
    this.tables.set(newName, table)
  
    return table
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
    let table = this.tables.get(name)  // try loading table from memory
    if (!table)  // table does not exist in memory
      table = await this.loadTable(name)  // try loading table from disk, i.e., IndexedDB
    return table
  }
  
  async loadTable(name: string): Promise<Table> {
    const key = `${this.currentDB}::${name}`  // tables load from current DB
    const saved = await this.store.loadTable(key)
    if (!saved) {
      throw new Error(`Table ${name} does not exist`)
    }
    const table = new Table(  //initialize a table model from saved table's data
      saved.name,
      saved.columns,
      saved.rows ?? []
    )  
    this.tables.set(name, table)  // add table model initialized from disk to memory
    return table
  }
}