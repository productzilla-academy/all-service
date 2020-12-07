import Context from '../../context'
import {Pagination, Paginated} from '../../core/core.types'

export interface SearchItem {
  regex?: string
  operator?: string
  value?: string
}

export interface Search {
  (key: string): SearchItem | SearchItem[]
} 

export default interface StorageProvider {
  create<T>(context: Context, object: T): Promise<T>
  fetch<T>(context: Context, pagination: Pagination, searchQuery: Search): Promise<Paginated<T[]>>
  count<T>(context: Context, pagination: Pagination, searchQuery: Search): Promise<number>
  get<T>(context: Context, uuid: string): Promise<T>
  update<T>(context: Context, uuid: string, object: T): Promise<T>
  delete<T>(context: Context, uuid: string): Promise<T>
}