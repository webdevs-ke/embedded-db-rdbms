import {
    CreateDatabaseStmt,
    UseDatabaseStmt,
    DropDatabaseStmt,
    SqlStatement,
    CreateTableStmt,
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
      const [, table, cols] = /CREATE TABLE (\w+) \((.+)\)/.exec(sql)!
  
      return {
        kind: 'CREATE_TABLE',
        table,
        columns: cols.split(',').map(c => {
          const p = c.trim().split(' ')
          return {
            name: p[0],
            datatype: p[1],
            primary: p.includes('PRIMARY'),
            unique: p.includes('UNIQUE')
          }
        })
      }
    }
  
    private parseInsert(sql: string): InsertStmt {
      const [, table, vals] =
        /INSERT INTO (\w+) VALUES \((.+)\)/.exec(sql)!
  
      return {
        kind: 'INSERT',
        table,
        values: vals.split(',').map(v =>
          v.trim().replace(/'/g, '')
        )
      }
    }
  
    private parseSelect(sql: string): SelectStmt {
      const [, table, , col, val] =
        /SELECT \* FROM (\w+)( WHERE (\w+)=(.+))?/.exec(sql)!
  
      return {
        kind: 'SELECT',
        table,
        where: col
          ? { col: col, value: val.replace(/'/g, '') }
          : undefined
      }
    }
  
    private parseUpdate(sql: string): UpdateStmt {
      const [, table, set, col, val] =
        /UPDATE (\w+) SET (.+) WHERE (\w+)=(.+)/.exec(sql)!
  
      const changes: Record<string, any> = {}
      set.split(',').forEach(p => {
        const [k, v] = p.split('=')
        changes[k.trim()] = v.replace(/'/g, '').trim()
      })
  
      return {
        kind: 'UPDATE',
        table,
        set: changes,
        where: { col: col, value: val.replace(/'/g, '') }
      }
    }
  
    private parseDelete(sql: string): DeleteStmt {
      const [, table, col, val] =
        /DELETE FROM (\w+) WHERE (\w+)=(.+)/.exec(sql)!
  
      return {
        kind: 'DELETE',
        table,
        where: { col: col, value: val.replace(/'/g, '') }
      }
    }
}    