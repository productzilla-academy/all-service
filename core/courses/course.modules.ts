
// type Module struct {
// 	core.General

import { General } from "../core.types";
import Course from "./course";
import Quiz from "./course.quiz";

export default interface Module extends General{
  course: Course
  parentModule?: Module
  content: string
  quiz?: Quiz
  weight: number
  open: Date
}