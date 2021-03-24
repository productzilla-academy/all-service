import ConfigProvider from "../../../config";
import Context from "../../../context";
import { PaginationParam, Paginated } from "../../../core/core.types";
import { Module } from "../../../core/courses";
import { Student, Enrollment } from "../../../core/enrollment/enroll";
import { EnrollmentStorageManager } from "../../../core/enrollment/enrollment.manager";
import { HerarcialModuleProcess, ModuleProcess } from "../../../core/enrollment/learn.process";
import { Answer } from "../../../core/enrollment/quiz.result";
import { SQLDBProtocols } from "../../storage/storage.types";
import EnrollmentElasticsearchStorageProvider from "./elasticsearch/enrollment.elasticsearch.storage.provider";
import { EnrollmentSQLStorageProvider } from "./sql/enrollment.sql.storage.provider";

export default class EnrollmentStorageProvider implements EnrollmentStorageManager {
  configProvider: ConfigProvider

  hotDB: EnrollmentStorageManager
  coldDB: EnrollmentStorageManager
  
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.coldDB = SQLDBProtocols.indexOf(this.configProvider.dsnProtocol()) >= 0 ? new EnrollmentSQLStorageProvider(configProvider): null 
    this.hotDB = !configProvider.elasticsearchURL() ? null : new EnrollmentElasticsearchStorageProvider(configProvider)
  }
  herarcialModuleProgress(context: Context, student: Student, courseUUID: string): Promise<HerarcialModuleProcess[]> {
    return this.hotDB && this.hotDB.herarcialModuleProgress(context, student, courseUUID) || this.coldDB.herarcialModuleProgress(context, student, courseUUID)
  }
  async enroll(context: Context, student: Student, courseUUID: string, open: Date, expire?: Date): Promise<void> {
    const p: Promise<void>[] = [
      this.coldDB.enroll(context, student, courseUUID, open, expire)
    ]
    if (this.hotDB) p.push(this.hotDB.enroll(context, student, courseUUID, open, expire))
    await Promise.all(p)
  }
  fetchEnrollment(context: Context, student: Student, pagination?: PaginationParam): Promise<Paginated<Enrollment>> {
    return this.hotDB && this.hotDB.fetchEnrollment(context, student, pagination) || this.coldDB.fetchEnrollment(context, student, pagination)
  }
  getEnrollment(context: Context, student: Student, courseUUID: string): Promise<Enrollment> {
    return this.hotDB && this.hotDB.getEnrollment(context, student, courseUUID) || this.coldDB.getEnrollment(context, student, courseUUID)
  }
  async process(context: Context, student: Student, courseUUID: string, moduleUUID: String, progress?: number): Promise<{ next: Module }> {
    const p: Promise<{ next: Module }>[] = [
      this.coldDB.process(context, student, courseUUID, moduleUUID, progress)
    ]
    if(this.hotDB) p.push(this.hotDB.process(context, student, courseUUID, moduleUUID, progress))
    const r = await Promise.all(p)
    return r[r.length - 1]
  }
  getModuleProgress(context: Context, student: Student, courseUUID: string, moduleUUID: string): Promise<ModuleProcess> {
    return this.hotDB && this.hotDB.getModuleProgress(context, student, courseUUID, moduleUUID) || this.coldDB.getModuleProgress(context, student, courseUUID, moduleUUID)
  }
  fetchModuleProgress(context: Context, student: Student, courseUUID: string): Promise<ModuleProcess[]> {
    return this.hotDB && this.hotDB.fetchModuleProgress(context, student, courseUUID) || this.coldDB.fetchModuleProgress(context, student, courseUUID)
  }
  async quizSubmit(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, answers: Answer[]): Promise<{ answers:Answer[], next: Module }> {
    const p: Promise<{ answers:Answer[], next: Module }>[] = [
      this.coldDB.quizSubmit(context, student, courseUUID, moduleUUID, quizUUID, answers)
    ]
    if(this.hotDB) p.push(this.hotDB.quizSubmit(context, student, courseUUID, moduleUUID, quizUUID, answers))
    const r = await Promise.all(p)
    return r[r.length - 1]
  }
  getQuizResult(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Answer[]> {
    return this.hotDB && this.hotDB.getQuizResult(context, student, courseUUID, moduleUUID, quizUUID) || this.coldDB.getQuizResult(context, student, courseUUID, moduleUUID, quizUUID)
    
  }
  async updateAnswer(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, answer: Answer): Promise<void> {
    const p: Promise<void>[] = [
      this.coldDB.updateAnswer(context, student, courseUUID, moduleUUID, quizUUID, questionUUID, answer)
    ]
    if(this.hotDB) p.push(this.hotDB.updateAnswer(context, student, courseUUID, moduleUUID, quizUUID, questionUUID, answer))
    await Promise.all(p)

  }

  fetchAnswers(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Answer[]> {
    return this.hotDB && this.hotDB.fetchAnswers(context, student, courseUUID, moduleUUID, quizUUID) || this.coldDB.fetchAnswers(context, student, courseUUID, moduleUUID, quizUUID)
  }
}