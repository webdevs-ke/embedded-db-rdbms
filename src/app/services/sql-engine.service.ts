import { Injectable } from '@angular/core'
import { DatabaseService } from './database.service'
import { SqlParser } from './sql-parser'
import { SqlStatement } from './sql-ast'

@Injectable({
  providedIn: 'root',
})
export class SqlEngineService {
  private parser = new SqlParser()

  constructor(private db: DatabaseService) {}

  async execute(sql: string) {
    const ast = this.parser.parse(sql)
    return this.executeAst(ast)
  }

  private async executeAst(stmt: SqlStatement): Promise<any> {
    switch (stmt.kind) {
  
      case 'CREATE_DATABASE':
        await this.db.createDatabase(stmt.name)
        return `Database ${stmt.name} created`
  
      case 'DROP_DATABASE':
        await this.db.dropDatabase(stmt.name)
        return `Database ${stmt.name} dropped`
  
      case 'SHOW_DATABASES':
        return await this.db.listDatabases()
  
      case 'USE_DATABASE':
        await this.db.useDatabase(stmt.name)       
        return `Using database ${stmt.name}`

      case 'SHOW_TABLES': {
        const tables = await this.db.listTables()
        return {
          type: 'TABLE_LIST',
          tables
        }
      }        

      case 'DROP_TABLE': {
        await this.db.dropTable(stmt.table)
        return `Table ${stmt.table} dropped`
      }

      case 'ALTER_TABLE': {
        const action = stmt.actions[0]
      
        if (action.type === 'RENAME_TABLE') {
          const table = await this.db.renameTable(stmt.table, action.to)
          return {
            type: 'TABLE_SCHEMA',
            table: table.name,
            columns: table.columns
          }
        }
      
        const table = await this.db.table(stmt.table)
        for (const a of stmt.actions) {
          table.applyAlter(a)
        }      
        this.db.persist(table.name)
      
        return {
          type: 'TABLE_SCHEMA',
          table: table.name,
          columns: table.columns
        }
      }
      
      case 'CREATE_TABLE': {
        await this.db.createTable(
          stmt.table,
          stmt.columns.map(c => ({
            name: c.name,
            type: c.datatype as any,
            primary: c.primary,
            unique: c.unique
          }))
        )
        const table = await this.db.table(stmt.table)
        return {
          type: 'TABLE_SCHEMA',
          table: table.name,
          columns: table.columns
        }
      }
    
      case 'INSERT': {
        const row: any = {}
        const table = await this.db.table(stmt.table)
        table.columns.forEach((c, i) => row[c.name] = stmt.values[i])
      
        const updated = await this.db.insert(stmt.table, row)        
        return {
          type: 'TABLE_DATA',
          table: updated.name,
          rows: updated.rows
        }
      }        

      case 'SELECT': {
        const table = await this.db.select(stmt.table, stmt.where)
        return {
          type: 'TABLE_DATA',
          table: table.name,
          rows: table.rows
        }
      }

      case 'UPDATE': {
        const updated = await this.db.update(stmt.table, stmt.where, stmt.set)        
        return {
          type: 'TABLE_DATA',
          table: updated.name,
          rows: updated.rows
        }
      }
            
      case 'DELETE': {
        const updated = await this.db.delete(stmt.table, stmt.where)        
        return {
          type: 'TABLE_DATA',
          table: updated.name,
          rows: updated.rows
        }
      }        
    }
  }  
}