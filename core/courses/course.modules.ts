
// type Module struct {
// 	core.General

import { General } from "../core.types"
import Course from "./course"
import Quiz from "./course.quiz"

export enum ModuleType {
  Module = 'module',
  Assesment = 'assesment'
}
export interface Module extends General{
  course: Course
  parent_module?: Module
  sub_modules_count?: number,
  content: string,
  type: ModuleType,
  quiz?: Quiz
  weight: number
  number: number,
  material: string
}

export interface HerarcialModule {
  uuid: string,
  name: string,
  type: ModuleType
  sub_modules: HerarcialModule[]
}

export default Module