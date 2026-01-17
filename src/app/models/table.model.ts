import { Column } from "./column.model"
import { AlterAction } from "../services/sql-ast"

export class Table {
    name: string
    columns: Column[]
    rows: any[]
    indexes = new Map<string, Map<any, any>>()
  
    constructor(name: string, columns: Column[], rows: any[]) {
      this.name = name
      this.columns = columns
      this.rows = rows
  
      for (const c of columns) {
        if (c.primary || c.unique) {
          this.indexes.set(c.name, new Map())
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

    applyAlter(action: AlterAction) {
      switch (action.type) {    
        case 'ADD_COLUMN': {
          if (this.columns.some(c => c.name === action.column.name)) {
            throw new Error('Column already exists')
          }    
          this.columns.push(action.column)
    
          // initialize existing rows
          for (const row of this.rows) {
            row[action.column.name] = null
          }
          break
        }
    
        case 'DROP_COLUMN': {
          const idx = this.columns.findIndex(c => c.name === action.column)
          if (idx === -1) throw new Error('Column not found')
    
          const col = this.columns[idx]
          if (col.primary) throw new Error('Cannot drop PRIMARY KEY')
    
          this.columns.splice(idx, 1)
          for (const row of this.rows) {
            delete row[action.column]
          }
          break
        }
    
        case 'RENAME_COLUMN': {
          const col = this.columns.find(c => c.name === action.from)
          if (!col) throw new Error('Column not found')
    
          if (this.columns.some(c => c.name === action.to)) {
            throw new Error('Target column already exists')
          }
    
          col.name = action.to
          for (const row of this.rows) {
            row[action.to] = row[action.from]
            delete row[action.from]
          }
          break
        }
      }
    }    
  }