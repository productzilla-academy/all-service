
export interface SearchItem {
  regex?: string
  operator?: string
  value?: SearchItem
}

export interface Search {
  (key: string): SearchItem | SearchItem[]
} 
