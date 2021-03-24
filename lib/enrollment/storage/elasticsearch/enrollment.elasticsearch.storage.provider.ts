import ConfigProvider from "../../../../config";
import Context from "../../../../context";
import { PaginationParam, Paginated } from "../../../../core/core.types";
import { Module } from "../../../../core/courses";
import { Student, Enrollment } from "../../../../core/enrollment/enroll";
import { EnrollmentStorageManager } from "../../../../core/enrollment/enrollment.manager";
import { HerarcialModuleProcess, ModuleProcess } from "../../../../core/enrollment/learn.process";
import { Answer } from "../../../../core/enrollment/quiz.result";

export default class EnrollmentElasticsearchStorageProvider implements EnrollmentStorageManager {
  constructor(private configProvider: ConfigProvider){
    
  }
  fetchAnswers(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Answer[]> {
    throw new Error("Method not implemented.");
  }
  herarcialModuleProgress(context: Context, student: Student, courseUUID: string): Promise<HerarcialModuleProcess[]> {
    throw new Error("Method not implemented.");
  }
  enroll(context: Context, student: Student, courseUUID: string, open: Date, expire?: Date): Promise<void> {
    throw new Error("Method not implemented.");
  }
  fetchEnrollment(context: Context, student: Student, pagination?: PaginationParam): Promise<Paginated<Enrollment>> {
    throw new Error("Method not implemented.");
  }
  getEnrollment(context: Context, student: Student, couresUUID: string): Promise<Enrollment> {
    throw new Error("Method not implemented.");
  }
  process(context: Context, student: Student, courseUUID: string, moduleUUID: String, progress?: number): Promise<{ next: Module }> {
    throw new Error("Method not implemented.");
  }
  getModuleProgress(context: Context, student: Student, courseUUID: string, moduleUUID: string): Promise<ModuleProcess> {
    throw new Error("Method not implemented.");
  }
  fetchModuleProgress(context: Context, student: Student, courseUUID: string): Promise<ModuleProcess[]> {
    throw new Error("Method not implemented.");
  }
  quizSubmit(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, answers: Answer[]): Promise<{ answers:Answer[], next: Module }> {
    throw new Error("Method not implemented.");
  }
  getQuizResult(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Answer[]> {
    throw new Error("Method not implemented.");
  }
  updateAnswer(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, answer: Answer): Promise<void>{
    throw new Error("Method not implemented.");
  }
}