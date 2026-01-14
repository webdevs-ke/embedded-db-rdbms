import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Column } from '../models/column.model';

@Injectable({
  providedIn: 'root',
})
export class SqlEngineService {
  constructor(private db: DatabaseService) {}

  execute(sql: string): any {
    sql = sql.trim()

    if (sql.startsWith('CREATE')) return this.create(sql)
    if (sql.startsWith('INSERT')) return this.insert(sql)
    if (sql.startsWith('SELECT')) return this.select(sql)
    if (sql.startsWith('DELETE')) return this.delete(sql)

    throw new Error('Unsupported SQL')
  }

  private create(sql: string) {
    const m = /CREATE TABLE (\w+) \((.+)\)/.exec(sql)!
    const [, name, cols] = m

    const columns: Column[] = cols.split(',').map(c => {
      const parts = c.trim().split(' ')
      return {
        name: parts[0],
        type: parts[1] as any,
        primary: parts.includes('PRIMARY'),
        unique: parts.includes('UNIQUE')
      }
    })

    this.db.createTable(name, columns)
    return `Table ${name} created`
  }

  private insert(sql: string) {
    const m = /INSERT INTO (\w+) VALUES \((.+)\)/.exec(sql)!
    const [, table, values] = m
    const t = this.db.table(table)

    const vals = values.split(',').map(v => v.trim().replace(/'/g, ''))
    const row: any = {}

    t.columns.forEach((c, i) => {
      row[c.name] = c.type === 'INT' ? Number(vals[i]) : vals[i]
    })

    t.insert(row)
    return 'Row inserted'
  }

  private select(sql: string) {
    const m = /SELECT \* FROM (\w+)( WHERE (\w+)=(.+))?/.exec(sql)!
    const [, table, , col, val] = m
    return this.db.table(table).select(col ? { col, value: val.replace(/'/g, '') } : undefined)
  }

  private update(sql: string) {
    const [, table, set, col, val] =
      /UPDATE (\w+) SET (.+) WHERE (\w+)=(.+)/.exec(sql)!
  
    const changes: any = {}
    set.split(',').forEach(p => {
      const [k, v] = p.split('=')
      changes[k.trim()] = v.replace(/'/g, '').trim()
    })
  
    this.db.table(table)
      .update({ col, value: val.replace(/'/g, '') }, changes)
  
    this.db.persist(table)
    return 'Updated'
  }
  
  private delete(sql: string) {
    const m = /DELETE FROM (\w+) WHERE (\w+)=(.+)/.exec(sql)!
    const [, table, col, val] = m
    this.db.table(table).delete({ col, value: val.replace(/'/g, '') })
    return 'Deleted'
  }

  // inner join
  private join(sql: string) {
    const [, t1, t2, aCol, bCol] =
      /FROM (\w+) JOIN (\w+) ON (\w+)\.(\w+)=(\w+)\.(\w+)/.exec(sql)!
  
    const left = this.db.table(t1).rows
    const right = this.db.table(t2).rows
  
    return left.flatMap(l =>
      right
        .filter(r => l[aCol] === r[bCol])
        .map(r => ({ ...l, ...r }))
    )
  }  
}
