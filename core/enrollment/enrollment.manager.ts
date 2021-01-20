import Context from "../../context"
import { ObjectValueOf, Paginated, PaginationParam } from "../core.types"
import { BillingPlan } from "../transactions/billing"
import Course from "../courses/course"
import { Enrollment, Student } from "./enroll"
import Module from "../courses/course.modules"
import Quiz from "../courses/course.quiz"
import { LearnProcess } from "./learn.process"
import { QuizResult } from "./quiz.result"
import { Question } from "../courses/course.quiz.questions"
export interface Param {
  pagination: PaginationParam
  search: ObjectValueOf<string>
}

export interface EnrollmentStorageManager {
  enroll(context: Context, courseUUID: string, student: Student, open: Date, expire?: Date): Promise<void>
  fetchEnrollment(context: Context, student: Student, pagination?: PaginationParam): Promise<Paginated<Enrollment>>
  getEnrollment(context: Context, couresUUID: string, student: string): Promise<Enrollment>

  process(context: Context, moduleUUID: String, students: Student): Promise<void>
  getLearnProcess(context: Context, courseUUID: string, studentUsername: string): Promise<LearnProcess>
  
  quizSubmit(context: Context, quiz: Quiz, question: Question, answer: string): Promise<void>
  getQuizResult(context: Context, quizUUID: string, studentUsername: string): Promise<QuizResult>
  
}

export default interface EnrollmentManager {
  storage(): EnrollmentStorageManager
}