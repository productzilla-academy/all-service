import Context from "../../context"
import { ObjectValueOf, Paginated, PaginationParam } from "../core.types"
import { Enrollment, Student } from "./enroll"
import { Answer } from "./quiz.result"
import { HerarcialModuleProcess, ModuleProcess } from './learn.process'
import { Module } from "../courses"
export interface Param {
  pagination: PaginationParam
  search: ObjectValueOf<string>
}

export interface EnrollmentStorageManager {
  enroll(context: Context, student: Student, courseUUID: string, open: Date, expire?: Date): Promise<void>
  fetchEnrollment(context: Context, student: Student, pagination?: PaginationParam): Promise<Paginated<Enrollment>>
  getEnrollment(context: Context, student: Student, couresUUID: string): Promise<Enrollment>

  process(context: Context, student: Student, courseUUID: string, moduleUUID: String, progress?: number): Promise<{ next: Module }>
  getModuleProgress(context: Context, student: Student, courseUUID: string, moduleUUID: string): Promise<ModuleProcess>
  fetchModuleProgress(context: Context, student: Student, courseUUID: string): Promise<ModuleProcess[]>

  herarcialModuleProgress(context: Context, student: Student, courseUUID: string): Promise<HerarcialModuleProcess[]>
  
  quizSubmit(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, answers: Answer[]): Promise<{ next: Module }>
  getQuizResult(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Answer[]>
  updateAnswer(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, answer: Answer): Promise<void>
}

export interface EnrollmentObjectStorageManager{
  uploadFileAnswer(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, file: Buffer): Promise<string>
}

export default interface EnrollmentManager {
  storage(): EnrollmentStorageManager
  objectStorage(): EnrollmentObjectStorageManager
}