import Context from "../../context";
import { ObjectValueOf, Paginated, PaginationParam, Param, UploadBulkFiles, UploadSingleFile } from "../core.types";
import Course, { CourseQueryParam } from "./course";
import Module, { HerarcialModule } from "./course.modules";
import Quiz from "./course.quiz";
import { Options, Question } from "./course.quiz.questions";
import Certificate from "./course.result.certificate";

export interface CourseStorageManager {
  fetchCourses(context: Context, param?: Param<CourseQueryParam>): Promise<Paginated<Course[]>>
  getCourse(context: Context, courseUUID: string): Promise<Course>
  checkCoursesLinkPath(context: Context, linkPath: string): Promise<void>
  createCourse(context: Context, course: Course): Promise<Course>
  updateCourse(context: Context, uuid: string, course: Course): Promise<Course>
  deleteCourse(context: Context, uuid: string): Promise<Course>
  
  fetchResultCertificate(context: Context, courseUUID: string): Promise<Certificate[]>
  getResultCertificate(context: Context, courseUUID: string, certificateUUID: string): Promise<Certificate>
  createResultCertificate(context: Context, courseUUID: string, certificate: Certificate): Promise<Certificate>
  updateResultCertificate(context: Context, courseUUID: string, certificateUUID: string, certificate: Certificate): Promise<Certificate>
  deleteResultCertificate(context: Context, courseUUID: string, certificateUUID: string): Promise<Certificate>
  
  fetchModules(context, courseUUID: string, parentModule?: string): Promise<Module[]>
  herarcialModules(context: Context, courseUUID: string): Promise<HerarcialModule[]>
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
  deleteModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Question>

  fetchModuleQuizQuestionOptions(context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Options[]>
  updateModuleQuizQuestionOptions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, options: Options[]): Promise<Options[]>
}


export interface CourseObjectStorageManager {
  changeCourseCover(context: Context, courseUUID: string, cover: Buffer): Promise<void>
  pipeCourseCover(context: Context, courseUUID: string, pipe: any): void
  uploadCourseFile(context: Context, courseUUID: string, file: Buffer, filename: string): Promise<void>
  deleteCourseFile(context: Context, couresUUID: string, objectID: string): Promise<void>
  fetchCourseFiles(context: Context, courseUUID: string): Promise<string[]>
  pipeCourseFile(context: Context, courseUUID: string, fileName: string, pipe: any): void

  uploadModuleCover (context: Context, courseUUID: string, moduleUUID: string, cover: Buffer): Promise<void>
  pipeModuleCover (context: Context, courseUUID: string, moduleUUID: string, pipe: any): void
  
  uploadModuleFile(context: Context, courseUUID: string, moduleUUID: string, file: Buffer, filename: string): Promise<void>
  fetchModuleFiles (context: Context, courseUUID: string, moduleUUID: string): Promise<string[]>
  deleteModuleFile (context: Context, courseUUID: string, moduleUUID: string, objectID: string): Promise<void>
  pipeModuleFile(context: Context, courseUUID: string, moduleUUID: string, fileName: string, pipe: any): void

}

export default interface CourseManager {
  objectStorage(): CourseObjectStorageManager
  storage(): CourseStorageManager
}