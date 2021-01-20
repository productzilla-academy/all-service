import ConfigProvider from "../../../../config";
import Context from "../../../../context";
import { PaginationParam, Paginated } from "../../../../core/core.types";
import { CourseStorageManager } from "../../../../core/courses";
import Quiz from "../../../../core/courses/course.quiz";
import { Question } from "../../../../core/courses/course.quiz.questions";
import { Student, Enrollment } from "../../../../core/enrollment/enroll";
import { EnrollmentStorageManager } from "../../../../core/enrollment/enrollment.manager";
import { LearnProcess } from "../../../../core/enrollment/learn.process";
import { QuizResult } from "../../../../core/enrollment/quiz.result";
import { NotFoundError } from "../../../../errors";
import CourseSQLStorageProvider from "../../../courses/storage/sql";
import Connection, { tables } from "../../../storage/drivers/sql/connection"
export class EnrollmentSQLStorageProvider implements EnrollmentStorageManager {
  configProvider: ConfigProvider
  private courseProvider: CourseStorageManager
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.courseProvider = new CourseSQLStorageProvider(configProvider)
  }
  fetchEnrollment(context: Context, student: Student, pagination?: PaginationParam): Promise<Paginated<Enrollment>> {
    throw new Error("Method not implemented.");
  }
  private getEnrollmentDB(){
    return Connection(this.configProvider)(tables.INDEX_TABLE_ENROLLMENTS)
  }
  private getQuizDB(){
    return Connection(this.configProvider)(tables.INDEX_TABLE_QUIZ)
  }
  private learnProcessDB(){
    return Connection(this.configProvider)(tables.INDEX_TABLE_LEARN_PROCESS)
  }
  async enroll(context: Context, courseUUID: string, student: Student, open: Date, expire?: Date): Promise<void> {
    const db = this.getEnrollmentDB()
    const c = await this.courseProvider.getCourse(context, courseUUID)
    await db.insert({
      student,
      open,
      course: c.id,
      expire
    })
  }
  async getEnrollment(context: Context, courseUUID: string, student: string): Promise<Enrollment> {
    const db = this.getEnrollmentDB()
    const [course, [en]] = await Promise.all([
      this.courseProvider.getCourse(context, courseUUID),
      db.where({ student })
    ])
    if(!en) throw NotFoundError(`No enrollment with that data`)
    return {
      ...en,
      course
    }
  }
  async process(context: Context, moduleUUID: string, students: Student): Promise<void> {
    
  }
  getLearnProcess(context: Context, moduleUUID: string, studentUsername: string): Promise<LearnProcess> {
    throw new Error("Method not implemented.");
  }
  quizSubmit(context: Context, quiz: Quiz, question: Question, answer: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getQuizResult(context: Context, quizUUID: string, studentUsername: string): Promise<QuizResult> {
    throw new Error("Method not implemented.");
  }

}