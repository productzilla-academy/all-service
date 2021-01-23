import { Generic } from "../core.types"
import Module from "../courses/course.modules"
import Quiz from "../courses/course.quiz"
import { Question } from "../courses/course.quiz.questions"
import { Student } from "./enroll"

export interface QuizResult extends Generic {
  quiz: Quiz
  students: Student
  result: number
}

export interface Answer extends Generic {
  question: Question
  answer: string
  student: Student
  point: number
  checked: boolean
  is_true: boolean
}