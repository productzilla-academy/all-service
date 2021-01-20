
// type Generic struct {
// 	ID      int64     `json:"-"`
// 	UUID    string    `json:"id"`
// 	Created time.Time `json:"created"`
// 	Updated time.Time `json:"updated"`

import Context from "../context"
import Assets from "./assets/asset"

// }
export interface Generic {
  id?: number
  uuid: string 
  created?: Date
  updated?: string
}

export interface Resource {
  videos: Assets[]
  images: Assets[]
  documents: Assets[]
}

export interface General extends Generic{
  name: string
  description: string
  overview?: string
  link_path?: string
}

export interface PaginationParam {
  page: number
  size: number
}

export interface Pagination extends PaginationParam {
  total_page: number
  total_size: number
}

export interface Paginated<Type> {
  pagination: Pagination
  data: Type[]
}

export interface ObjectValueOf<T> {
 [key: string]: T
}

export interface UploadSingleFile {
  (context: Context, key: string, file: Buffer): Promise<void>
}
export interface UploadBulkFiles {
  (context: Context, key: string, files: Buffer[]): Promise<void>
}

export interface Param<T> {
  pagination?: PaginationParam
  search?: T
}