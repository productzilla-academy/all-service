import { Career, Level } from "../careers"
import { General, Resource } from "../core.types"

export enum CourseStatus {
  WAITING = 0,
  PUBLISHED = 1,
  RETURNED = 2,
  DEACTIVATED = 3
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
  cover?: string
}


export interface CourseQueryParam {
  tutor?: string
  level?: string
  career?: string
}


export default Course