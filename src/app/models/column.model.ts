export type DataType = 'INT' | 'TEXT' | 'BLOB'

export interface Column {
  name: string
  type: DataType
  primary?: boolean
  unique?: boolean
}