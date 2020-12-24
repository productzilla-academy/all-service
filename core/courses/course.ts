import { Level } from "../careers";
import { General, Resource } from "../core.types"

export enum CourseStatus {
  PUBLISHED = 1,
  WAITING = 0,
  DECLINED = 2
}

export interface Course extends General {
  level: Level
  tutor: string
  resources: Resource
  open: Date
  number: number
  status: CourseStatus
}


export interface CourseQueryParam {
  tutor: string
  level: string
}


export default Course