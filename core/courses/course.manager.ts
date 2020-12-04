import Context from "../../context";
import { ObjectValueOf, Paginated, PaginationParam } from "../core.types";
import Course from "./course";
import Module from "./course.modules";
import Quiz from "./course.quiz";
import Certificate from "./course.result.certificate";

export interface Param {
  pagination: PaginationParam
  search: ObjectValueOf<string>
}

export default interface CourseManager{
  fetchCourses(context: Context, param: Param): Promise<Paginated<Course>>
  checkCoursesLinkPath(context: Context, linkPath: string): Promise<void>
  createCourse(context: Context, course: Course): Promise<Course>
  updateCourse(context: Context, uuid: string, course: Course): Promise<Course>
  deleteCourse(context: Context, uuid: string): Promise<Course>
  
  fetchResult(context: Context, courseUUID: string): Promise<Certificate>
  createResult(context: Context, courseUUID: string, certificate: Certificate): Promise<Certificate>
  deleteResult(context: Context, courseUUID: string, certificateUUID: string): Promise<Certificate>
  
  fetchModules(context, courseUUID: string, parentModule?: string): Promise<Module>
  checkModulesLinkPath(context: Context, linkPath: string): Promise<void>
  createModule(context: Context, courseUUID: string, module: Module): Promise<Module>
  updateModule(context: Context, courseUUID: string, moduleUUID: string, module: Module): Promise<Module>
  deleteModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module>
  
  fetchModuleQuiz(context, courseUUID: string, moduleUUID: string): Promise<Quiz>
  createModuleQuiz(context: Context, courseUUID: string, moduleUUID:string, quiz: Quiz): Promise<Quiz>
  updateModuleQuiz(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, quiz: Quiz): Promise<Quiz>
  deleteModuleQuiz(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Quiz>
}