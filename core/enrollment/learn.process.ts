import { Generic } from "../core.types"
import { Course } from "../courses"
import Module from "../courses/course.modules"
import { Student } from "./enroll"

export interface ModuleProcess extends Generic {
  module: Module
  students: Student
  progress: number
}

export interface LearnProcess {
  modules: ModuleProcess[]
  course: Course
  progress: number
}