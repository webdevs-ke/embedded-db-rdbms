export type DataType = 'INT' | 'TEXT'

export interface Column {
  name: string
  type: DataType
  primary?: boolean
  unique?: boolean
}