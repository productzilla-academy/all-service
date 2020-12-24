
// type Module struct {
// 	core.General

import { General } from "../core.types";
import Course from "./course";
import Quiz from "./course.quiz";
export interface Module extends General{
  course: Course
  parent_module?: Module
  sub_modules_count: number,
  content: string
  quiz?: Quiz
  weight: number
}
export default Module