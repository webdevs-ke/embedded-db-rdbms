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
    console.log('SQL statement type:', stmt.kind)
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
  
      case 'CREATE_TABLE':
        this.db.createTable(
          stmt.table,
          stmt.columns.map(c => ({
            name: c.name,
            type: c.datatype as any,
            primary: c.primary,
            unique: c.unique
          }))
        )
        return `Table ${stmt.table} created`
  
      case 'INSERT': {
        const t = this.db.table(stmt.table)
        const row: any = {}
        t.columns.forEach((c, i) => row[c.name] = stmt.values[i])
        t.insert(row)
        return 'Values Inserted'
      }
  
      case 'SELECT':
        return this.db.table(stmt.table).select(stmt.where)
  
      case 'UPDATE':
        this.db.table(stmt.table).update(stmt.where, stmt.set)
        return 'Table Updated'
  
      case 'DELETE':
        this.db.table(stmt.table).delete(stmt.where)
        return 'Values Deleted'
    }
  }  
}