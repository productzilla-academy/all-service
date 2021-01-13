import { General, Resource } from "../core.types"

export enum CourseStatus {
  WAITING = 0,
  PUBLISHED = 1,
  RETURNED = 2,
  DEACTIVATED = 3
}

export interface Course extends General {
  tutor: string
  open: Date
  number: number
  status: CourseStatus
  cover?: string
}


export interface CourseQueryParam {
  tutor?: string
  level?: string
}


export default Course