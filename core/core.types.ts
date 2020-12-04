
// type Generic struct {
// 	ID      int64     `json:"-"`
// 	UUID    string    `json:"id"`
// 	Created time.Time `json:"created"`
// 	Updated time.Time `json:"updated"`

import Assets from "./asset/asset";

// }
export interface Generic {
  id: number
  uuid: string 
  created: Date
  updated: string
}

export interface Resource {
  videos: Assets[]
  images: Assets[]
  documents: Assets[]
}

export interface General extends Generic{
  name: string
  description: string
  resources: Resource
  overview: string
  linkPath: string
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
  pagiation: Pagination
  data: Type
}

export interface ObjectValueOf<T> {
 [key: string]: T
}