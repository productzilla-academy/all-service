import { General } from "../core.types";
import Module from "./course.modules";
import { Question } from "./course.quiz.questions";
export interface Quiz extends General {
  module: Module
  number: number
  questions: Question[]
}
export default Quiz