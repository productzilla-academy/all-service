import { General } from "../core.types";
import Module from "./course.modules";
import { Question } from "./course.quiz.questions";
export interface Quiz extends General {
  module: Module
  questions: Question[]
}
export default Quiz