import Context from "../../context";
import { ObjectValueOf, Paginated, PaginationParam } from "../core.types";
import Course, { CourseQueryParam } from "./course";
import Module from "./course.modules";
import Quiz from "./course.quiz";
import { Options, Question } from "./course.quiz.questions";
import Certificate from "./course.result.certificate";

export interface Param<T> {
  pagination: PaginationParam
  search: T
}

export default interface CourseManager {
  fetchCourses(context: Context, param: Param<CourseQueryParam>): Promise<Paginated<Course[]>>
  getCourse(context: Context, courseUUID: string): Promise<Course>
  checkCoursesLinkPath(context: Context, linkPath: string): Promise<void>
  createCourse(context: Context, course: Course): Promise<Course>
  updateCourse(context: Context, uuid: string, course: Course): Promise<Course>
  deleteCourse(context: Context, uuid: string): Promise<Course>
  
  getResultCertificate(context: Context, courseUUID: string): Promise<Certificate>
  createResultCertificate(context: Context, courseUUID: string, certificate: Certificate): Promise<Certificate>
  deleteResultCertificate(context: Context, courseUUID: string): Promise<Certificate>
  
  fetchModules(context, courseUUID: string, parentModule?: string): Promise<Module[]>
  getModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module>
  checkModulesLinkPath(context: Context, linkPath: string): Promise<void>
  createModule(context: Context, courseUUID: string, module: Module): Promise<Module>
  updateModule(context: Context, courseUUID: string, moduleUUID: string, module: Module): Promise<Module>
  deleteModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module>
  
  getModuleQuiz(context, courseUUID: string, moduleUUID: string): Promise<Quiz>
  createModuleQuiz(context: Context, courseUUID: string, moduleUUID:string, quiz: Quiz): Promise<Quiz>
  updateModuleQuiz(context: Context, courseUUID: string, moduleUUID: string, quiz: Quiz): Promise<Quiz>
  deleteModuleQuiz(context: Context, courseUUID: string, moduleUUID: string): Promise<Quiz>

  fetchModuleQuizQuestions(context, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Question[]>
  getModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Question>
  createModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, question: Question): Promise<Question>
  updateModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, question: Question): Promise<Question>
  deleteModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, question: Question): Promise<Question>

  fetchModuleQuizQuestionOptions(context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Options[]>
  updateModuleQuizQuestionOptions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, options: Options): Promise<Options[]>
}