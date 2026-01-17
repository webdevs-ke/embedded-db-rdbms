import {
    SqlStatement,
    CreateDatabaseStmt,
    UseDatabaseStmt,
    DropDatabaseStmt,
    ShowTablesStmt,
    CreateTableStmt,
    DropTableStmt,
    AlterTableStmt,
    InsertStmt,
    SelectStmt,
    UpdateStmt,
    DeleteStmt
  } from './sql-ast'
  
export class SqlParser {
    parse(sql: string): SqlStatement {
      sql = sql.trim()
      const upper = sql.toUpperCase()
      
      if (upper.startsWith('CREATE DATABASE')) return this.parseCreateDatabase(sql)
      if (upper.startsWith('DROP DATABASE')) return this.parseDropDatabase(sql)
      if (upper === 'SHOW DATABASES') return { kind: 'SHOW_DATABASES' }
      if (upper.startsWith('USE')) return this.parseUseDatabase(sql)
      if (upper === 'SHOW TABLES') return { kind: 'SHOW_TABLES' }
      if (upper.startsWith('DROP TABLE')) return this.parseDropTable(sql)
      if (upper.startsWith('ALTER TABLE')) return this.parseAlterTable(sql)

      if (upper.startsWith('CREATE TABLE')) return this.parseCreate(sql)
      if (upper.startsWith('INSERT')) return this.parseInsert(sql)
      if (upper.startsWith('SELECT')) return this.parseSelect(sql)
      if (upper.startsWith('UPDATE')) return this.parseUpdate(sql)
      if (upper.startsWith('DELETE')) return this.parseDelete(sql)
  
      throw new Error('Invalid SQL statement')
    }
  
    private parseCreateDatabase(sql: string): CreateDatabaseStmt {
      const [, name] = /CREATE DATABASE (\w+)/i.exec(sql) || []
      if (!name) throw new Error('Invalid CREATE DATABASE')
      
      return {
        kind: 'CREATE_DATABASE',
        name
      }
    }
      
    private parseDropDatabase(sql: string): DropDatabaseStmt {
      const [, name] = /DROP DATABASE (\w+)/i.exec(sql) || []
      if (!name) throw new Error('Invalid DROP DATABASE')
     
      return {
        kind: 'DROP_DATABASE',
        name
      }
    }
      
    private parseUseDatabase(sql: string): UseDatabaseStmt {
      const [, name] = /USE (\w+)/i.exec(sql) || []
      if (!name) throw new Error('Invalid USE')
     
      return {
        kind: 'USE_DATABASE',
        name
      }
    }
      
    private parseCreate(sql: string): CreateTableStmt {
      const match = /CREATE\s+TABLE\s+(\w+)\s*\((.+)\)/i.exec(sql)!
      if (!match) throw new Error(`Invalid CREATE TABLE syntax: ${sql}`)
      const [, table, cols] = match
  
      return {
        kind: 'CREATE_TABLE',
        table,
        columns: cols.split(',').map(c => {
          const p = c.trim().split(/\s+/)          
          return {
            name: p[0],
            datatype: p[1],
            primary: p.includes('PRIMARY'),
            unique: p.includes('UNIQUE')
          }
        })
      }
    }
  
    private parseDropTable(sql: string): DropTableStmt {
        const match = /DROP TABLE (\w+)/i.exec(sql)
        if (!match) {
          throw new Error('Invalid DROP TABLE syntax')
        }
      
        const [, table] = match
        return {
          kind: 'DROP_TABLE',
          table
        }
    }

    private parseAlterTable(sql: string): AlterTableStmt {
        // Normalize spacing
        sql = sql.trim().replace(/\s+/g, ' ')
      
        let m = /^ALTER TABLE (\w+) ADD COLUMN (\w+) (\w+)/i.exec(sql)
        if (m) {
          const [, table, name, datatype] = m
          return {
            kind: 'ALTER_TABLE',
            table,
            actions: [{
              type: 'ADD_COLUMN',
              column: {
                name,
                type: datatype as any,
                primary: false,
                unique: false
              }
            }]
          }
        }
      
        m = /^ALTER TABLE (\w+) DROP COLUMN (\w+)/i.exec(sql)
        if (m) {
          const [, table, column] = m
          return {
            kind: 'ALTER_TABLE',
            table,
            actions: [{ type: 'DROP_COLUMN', column }]
          }
        }
      
        m = /^ALTER TABLE (\w+) RENAME COLUMN (\w+) TO (\w+)/i.exec(sql)
        if (m) {
          const [, table, from, to] = m
          return {
            kind: 'ALTER_TABLE',
            table,
            actions: [{ type: 'RENAME_COLUMN', from, to }]
          }
        }
      
        m = /^ALTER TABLE (\w+) RENAME TO (\w+)/i.exec(sql)
        if (m) {
          const [, table, to] = m
          return {
            kind: 'ALTER_TABLE',
            table,
            actions: [{ type: 'RENAME_TABLE', to }]
          }
        }      
        throw new Error('Invalid ALTER TABLE syntax')
    }      
      
    private parseInsert(sql: string): InsertStmt {
      const match = /INSERT\s+INTO\s(\w+)\s+VALUES\s*\((.+)\)\s*;?/i.exec(sql)!
      if (!match) throw new Error(`Invalid INSERT syntax: ${sql}`)
      const [, table, vals] = match
  
      return {
        kind: 'INSERT',
        table,
        values: this.splitValues(vals)
      }
    }
   
    private parseSelect(sql: string): SelectStmt {
      const match = /SELECT\s+\*\s+FROM\s+(\w+)(?:\s+WHERE\s+(\w+)\s*=\s*(.+))?\s*;?/i.exec(sql)!
      if (!match) throw new Error(`Invalid SELECT syntax: ${sql}`)
      const [, table, , col, val] = match
  
      return {
        kind: 'SELECT',
        table,
        where: col
          ? { col, value: this.cleanValue(val) }
          : undefined
      }
    }
  
    private parseUpdate(sql: string): UpdateStmt {
        const match = /UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(\w+)\s*=\s*(.+)\s*;?/i.exec(sql)      
        if (!match) {
          throw new Error(`Invalid UPDATE syntax: ${sql}`)
        }      
        const [, table, setPart, col, val] = match      
        const changes: Record<string, any> = {}
      
        this.splitAssignments(setPart).forEach(p => {
          const [k, v] = p.split('=')
          changes[k.trim()] = this.cleanValue(v)
        })          
      
        return {
          kind: 'UPDATE',
          table,
          set: changes,
          where: { col, value: this.cleanValue(val) }
        }
    }
    
    private parseDelete(sql: string): DeleteStmt {
        const match = /DELETE\s+FROM\s+(\w+)\s+WHERE\s+(\w+)\s*=\s*(.+)\s*;?/i.exec(sql)
      
        if (!match) {
          throw new Error(`Invalid DELETE syntax: ${sql}`)
        }      
        const [, table, col, val] = match
      
        return {
          kind: 'DELETE',
          table,
          where: { col, value: this.cleanValue(val) }
        }
    }      

    private cleanValue(v: string): string {
      return v.trim().replace(/^'(.*)'$/, '$1')
    }

    private splitValues(input: string): string[] {
        const values: string[] = []
        let current = ''
        let inString = false
      
        for (let i = 0; i < input.length; i++) {
          const ch = input[i]      
          if (ch === "'" && input[i - 1] !== '\\') {
            inString = !inString
            continue
          }      
          if (ch === ',' && !inString) {
            values.push(current.trim())
            current = ''
            continue
          }      
          current += ch
        }      
        if (current) values.push(current.trim())
      
        return values.map(v => v.replace(/^'(.*)'$/, '$1'))
    }
     
    private splitAssignments(input: string): string[] {
        const parts: string[] = []
        let current = ''
        let inString = false
      
        for (let i = 0; i < input.length; i++) {
          const ch = input[i]      
          if (ch === "'" && input[i - 1] !== '\\') {
            inString = !inString
            current += ch
            continue
          }      
          if (ch === ',' && !inString) {
            parts.push(current.trim())
            current = ''
            continue
          }      
          current += ch
        }      
        if (current) parts.push(current.trim())
        return parts
    }      
}    