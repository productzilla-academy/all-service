import { Generic } from "../core.types"
import Module from "../courses/course.modules"
import { Student } from "./enroll"

export interface LearnProcess extends Generic {
  module: Module
  students: Student
  process: number
}