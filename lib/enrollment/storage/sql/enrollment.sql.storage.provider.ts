import ConfigProvider from "../../../../config";
import Context from "../../../../context";
import { CourseStorageManager } from "../../../../core/courses";
import Course from "../../../../core/courses/course";
import Module from "../../../../core/courses/course.modules";
import Quiz from "../../../../core/courses/course.quiz";
import { Question } from "../../../../core/courses/course.quiz.questions";
import { Student, Enrollment } from "../../../../core/enrollment/enroll";
import { EnrollmentStorageManager } from "../../../../core/enrollment/enrollment.manager";
import { LearnProcess } from "../../../../core/enrollment/learn.process";
import { QuizResult } from "../../../../core/enrollment/quiz.result";
import { BillingPlan } from "../../../../core/transactions/billing";
import CourseSQLStorageProvider from "../../../courses/storage/sql";
import Connection, { tables } from "../../../storage/drivers/sql/connection"
class EnrollmentSQLStorageProvider implements EnrollmentStorageManager {
  configProvider: ConfigProvider
  private courseProvider: CourseStorageManager
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.courseProvider = new CourseSQLStorageProvider(configProvider)
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
  getEnrollment(context: Context, couresUUID: string, student: string): Promise<Enrollment> {
    throw new Error("Method not implemented.");
  }
  process(context: Context, module: Module, students: Student, process: number): Promise<void> {
    throw new Error("Method not implemented.");
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