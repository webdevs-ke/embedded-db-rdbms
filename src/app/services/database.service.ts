import { Injectable } from '@angular/core';
import { Table } from '../models/table.model';
import { Column } from '../models/column.model';
import { IndexedDbService } from './indexeddb.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  tables = new Map<string, Table>();

  constructor(private store: IndexedDbService) {
    this.store.open()
  }

  async createTable(name: string, columns: Column[]) {
    if (this.tables.has(name)) return
  
    const table = new Table(name, columns)
    const saved = await this.store.loadTable(name)
  
    if (saved) Object.assign(table, saved)
  
    this.tables.set(name, table)
  }
  
  persist(name: string) {
    this.store.saveTable(name, this.tables.get(name))
  }
  
  table(name: string): Table {
    const t = this.tables.get(name);
    if (!t) throw new Error('Table not found');
    return t;
  }
}