import { Column } from '../models/column.model'

export type SqlStatement =
  | CreateDatabaseStmt
  | UseDatabaseStmt
  | ShowDatabasesStmt
  | DropDatabaseStmt
  | ShowTablesStmt
  | CreateTableStmt
  | DropTableStmt
  | AlterTableStmt
  | InsertStmt
  | SelectStmt
  | UpdateStmt
  | DeleteStmt

export interface CreateDatabaseStmt {
  kind: 'CREATE_DATABASE'
  name: string
}

export interface UseDatabaseStmt {
  kind: 'USE_DATABASE'
  name: string
}

export interface ShowDatabasesStmt {
  kind: 'SHOW_DATABASES'
}

export interface DropDatabaseStmt {
  kind: 'DROP_DATABASE'
  name: string
}
 
export interface ShowTablesStmt {
  kind: 'SHOW_TABLES'
}
  
export interface CreateTableStmt {
  kind: 'CREATE_TABLE'
  table: string
  columns: {
    name: string
    datatype: string
    primary: boolean
    unique: boolean
  }[]
}

export interface DropTableStmt {
  kind: 'DROP_TABLE'
  table: string
}

export type AlterAction =
  | { type: 'ADD_COLUMN'; column: Column }
  | { type: 'DROP_COLUMN'; column: string }
  | { type: 'RENAME_COLUMN'; from: string; to: string }
  | { type: 'RENAME_TABLE'; to: string }

export interface AlterTableStmt {
  kind: 'ALTER_TABLE'
  table: string
  actions: AlterAction[]
}

export interface InsertStmt {
  kind: 'INSERT'
  table: string
  values: (string | number)[]
}

export interface SelectStmt {
  kind: 'SELECT'
  table: string
  where?: {
    col: string
    value: any
  }
}

export interface UpdateStmt {
  kind: 'UPDATE'
  table: string
  set: Record<string, any>
  where: {
    col: string
    value: any
  }
}

export interface DeleteStmt {
  kind: 'DELETE'
  table: string
  where: {
    col: string
    value: any
  }
}