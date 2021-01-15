import { DSNProtocol } from "../../config"

export interface SearchItem {
  regex?: string
  operator?: string
  value?: SearchItem
}

export interface Search {
  (key: string): SearchItem | SearchItem[]
} 

export interface ObjectValueOf<T> {
  (key: string): T
}

export const SQLDBProtocols = [
  DSNProtocol.MYSQL.toString(),
  DSNProtocol.POSTGRESQL.toString()
]