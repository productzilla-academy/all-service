import ConfigProvider from "../../../../config"
import Context from "../../../../context"
import { Paginated, Param } from "../../../../core/core.types"
import { Certificate, Course, CourseQueryParam, CourseStorageManager, HerarcialModule, Module, Options, Question, Quiz } from "../../../../core/courses"

export default class CourseElasticsearchProvider implements CourseStorageManager {
  configProvider: ConfigProvider


  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
  }
  herarcialModules(context: Context, courseUUID: string): Promise<HerarcialModule[]> {
    throw new Error("Method not implemented.")
  }
  fetchCourses(context: Context, param: Param<CourseQueryParam>): Promise<Paginated<Course>> {
    throw new Error("Method not implemented.")
  }
  getCourse(context: Context, courseUUID: string): Promise<Course> {
    throw new Error("Method not implemented.")
  }
  checkCoursesLinkPath(context: Context, linkPath: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  createCourse(context: Context, course: Course): Promise<Course> {
    throw new Error("Method not implemented.")
  }
  updateCourse(context: Context, uuid: string, course: Course): Promise<Course> {
    throw new Error("Method not implemented.")
  }
  deleteCourse(context: Context, uuid: string): Promise<Course> {
    throw new Error("Method not implemented.")
  }
  getResultCertificate(context: Context, courseUUID: string): Promise<Certificate> {
    throw new Error("Method not implemented.")
  }
  fetchResultCertificate(context: Context, courseUUID: string): Promise<Certificate[]> {
    throw new Error("Method not implemented.")
  }
  updateResultCertificate(context: Context, courseUUID: string, certificateUUID: string, certificate: Certificate): Promise<Certificate> {
    throw new Error("Method not implemented.")
  }
  createResultCertificate(context: Context, courseUUID: string, certificate: Certificate): Promise<Certificate> {
    throw new Error("Method not implemented.")
  }
  deleteResultCertificate(context: Context, courseUUID: string): Promise<Certificate> {
    throw new Error("Method not implemented.")
  }
  fetchModules(context: any, courseUUID: string, parentModule?: string): Promise<Module[]> {
    throw new Error("Method not implemented.")
  }
  getModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module> {
    throw new Error("Method not implemented.")
  }
  checkModulesLinkPath(context: Context, linkPath: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  createModule(context: Context, courseUUID: string, module: Module): Promise<Module> {
    throw new Error("Method not implemented.")
  }
  updateModule(context: Context, courseUUID: string, moduleUUID: string, module: Module): Promise<Module> {
    throw new Error("Method not implemented.")
  }
  deleteModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module> {
    throw new Error("Method not implemented.")
  }
  getModuleQuiz(context: any, courseUUID: string, moduleUUID: string): Promise<Quiz> {
    throw new Error("Method not implemented.")
  }
  createModuleQuiz(context: Context, courseUUID: string, moduleUUID: string, quiz: Quiz): Promise<Quiz> {
    throw new Error("Method not implemented.")
  }
  updateModuleQuiz(context: Context, courseUUID: string, moduleUUID: string, quiz: Quiz): Promise<Quiz> {
    throw new Error("Method not implemented.")
  }
  deleteModuleQuiz(context: Context, courseUUID: string, moduleUUID: string): Promise<Quiz> {
    throw new Error("Method not implemented.")
  }
  fetchModuleQuizQuestions(context: any, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Question[]> {
    throw new Error("Method not implemented.")
  }
  getModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Question> {
    throw new Error("Method not implemented.")
  }
  createModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, question: Question): Promise<Question> {
    throw new Error("Method not implemented.")
  }
  updateModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, question: Question): Promise<Question> {
    throw new Error("Method not implemented.")
  }
  deleteModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Question> {
    throw new Error("Method not implemented.")
  }
  fetchModuleQuizQuestionOptions(context: any, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Options[]> {
    throw new Error("Method not implemented.")
  }
  updateModuleQuizQuestionOptions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, options: Options[]): Promise<Options[]> {
    throw new Error("Method not implemented.")
  }
}