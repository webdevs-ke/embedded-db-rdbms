export type SqlStatement =
  | CreateTableStmt
  | InsertStmt
  | SelectStmt
  | UpdateStmt
  | DeleteStmt

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