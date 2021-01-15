import { Career, Level } from "../careers"
import { General, Resource } from "../core.types"

export enum CourseStatus {
  WAITING = 0,
  PUBLISHED = 1,
  RETURNED = 2,
  DEACTIVATED = 3
}

export interface Extras {
  price: number
  active_price: number
  [p: string]: any
}

export interface CourseCareer {
  level: Level
  career: Career
  number: number
}

export interface Course extends General {
  tutor: string
  open: Date
  career?: CourseCareer[]
  status: CourseStatus
  cover?: string,
  extras?: Extras
}


export interface CourseQueryParam {
  tutor?: string
  level?: string
  career?: string
}


export default Course