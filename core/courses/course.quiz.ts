import { General } from "../core.types";
import Module from "./course.modules";
import { Question } from "./course.quiz.questions";

export default interface Quiz extends General {
  module: Module
  questions: Question[]
}