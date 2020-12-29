import Context from "../../context";
import { ObjectValueOf, Paginated, PaginationParam } from "../core.types";
import { BillingPlan } from "../transactions/billing";
import Course from "../courses/course";
import { Enrollment, Student } from "./enroll";
import Module from "../courses/course.modules";
import Quiz from "../courses/course.quiz";
import { LearnProcess } from "./learn.process";
import { QuizResult } from "./quiz.result";
import { Question } from "../courses/course.quiz.questions";
export interface Param {
  pagination: PaginationParam
  search: ObjectValueOf<string>
}

export interface EntrollmentStorageManager {
  enroll(context: Context, course: Course, billingPlan: BillingPlan, student: Student, open: Date, expire?: Date): Promise<void>
  getEnrollment(context: Context, couresUUID: string, student: string): Promise<Enrollment>

  process(context: Context, module: Module, students: Student, process: number): Promise<void>
  getLearnProcess(context: Context, moduleUUID: string, studentUsername: string): Promise<LearnProcess>
  
  quizSubmit(context: Context, quiz: Quiz, question: Question, answer: string): Promise<void>
  getQuizResult(context: Context, quizUUID: string, studentUsername: string): Promise<QuizResult>
  
}

export default interface EntrollmentManager {
  storage(): EntrollmentStorageManager
}