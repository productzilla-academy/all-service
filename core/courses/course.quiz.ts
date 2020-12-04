import { General } from "../core.types";
import { Question } from "./course.quiz.questions";

export default interface Quiz extends General {
  questions: Question[]
}