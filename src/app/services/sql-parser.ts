import {
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
  
      if (sql.startsWith('CREATE TABLE')) return this.parseCreate(sql)
      if (sql.startsWith('INSERT')) return this.parseInsert(sql)
      if (sql.startsWith('SELECT')) return this.parseSelect(sql)
      if (sql.startsWith('UPDATE')) return this.parseUpdate(sql)
      if (sql.startsWith('DELETE')) return this.parseDelete(sql)
  
      throw new Error('Invalid SQL statement')
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