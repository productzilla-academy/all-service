import { Generic } from "../core.types"
import { Course } from "../courses"
import Module, { ModuleType } from "../courses/course.modules"
import { Student } from "./enroll"

export interface ModuleProcess extends Generic {
  module: Module
  students: Student
  progress: number
  active: boolean
  done: boolean
}

export interface HerarcialModuleProcess {
  uuid: string
  name: string
  type: ModuleType
  sub_modules: HerarcialModuleProcess[]
  module_process: ModuleProcess
}
export interface LearnProcess {
  modules: ModuleProcess[]
  course: Course
  progress: number
}