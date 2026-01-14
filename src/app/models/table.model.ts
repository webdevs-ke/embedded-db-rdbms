import { Column } from "./column.model";

export class Table {
    name: string;
    columns: Column[];
    rows: any[] = [];
    indexes = new Map<string, Map<any, any>>();
  
    constructor(name: string, columns: Column[]) {
      this.name = name;
      this.columns = columns;
  
      for (const c of columns) {
        if (c.primary || c.unique) {
          this.indexes.set(c.name, new Map());
        }
      }
    }
  
    insert(row: any) {
      for (const col of this.columns) {
        if (col.primary || col.unique) {
          const idx = this.indexes.get(col.name)!
          if (idx.has(row[col.name])) {
            throw new Error(`Duplicate value for ${col.name}`)
          }
          idx.set(row[col.name], row)
        }
      }
      this.rows.push(row)
    }
  
    select(where?: { col: string, value: any }) {
      if (!where) return this.rows
      const idx = this.indexes.get(where.col)
      if (idx && idx.has(where.value)) {
        return [idx.get(where.value)]
      }
      return this.rows.filter(r => r[where.col] === where.value)
    }
  
    update(where: { col: string; value: any }, changes: any) {
        for (const row of this.rows) {
          if (row[where.col] === where.value) {
            Object.assign(row, changes)
          }
        }
      }
      
    delete(where: { col: string, value: any }) {
      this.rows = this.rows.filter(r => r[where.col] !== where.value)
      const idx = this.indexes.get(where.col)
      if (idx) idx.delete(where.value)
    }
  }