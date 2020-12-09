import Context from '../../context'
import {Pagination, Paginated} from '../../core/core.types'
import { Search } from './storage.types'

export default interface StorageProvider {
  create<T>(context: Context, object: T): Promise<T>
  fetch<T>(context: Context, pagination: Pagination, searchQuery: Search): Promise<Paginated<T[]>>
  count(context: Context, pagination: Pagination, searchQuery: Search): Promise<number>
  get<T>(context: Context, uuid: string): Promise<T>
  update<T>(context: Context, uuid: string, object: T): Promise<T>
  delete<T>(context: Context, uuid: string): Promise<T>
}