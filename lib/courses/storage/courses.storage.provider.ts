import ConfigProvider from "../../../config"
import Context from "../../../context"
import { Paginated, Param } from "../../../core/core.types"
import { Certificate, Course, CourseQueryParam, CourseStorageManager, HerarcialModule, Module, Options, Question, Quiz } from "../../../core/courses"
import { SQLDBProtocols } from "../../storage/storage.types"
import CourseElasticsearchProvider from "./elasticsearch/course.elasticsearch.storage.provider"
import CourseSQLStorageProvider from "./sql"
import * as UUID from 'uuid'

export class CourseStorageProvider implements CourseStorageManager{
  configProvider: ConfigProvider

  hotDB: CourseStorageManager
  coldDB: CourseStorageManager
  
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.coldDB = SQLDBProtocols.indexOf(this.configProvider.dsnProtocol()) >= 0 ? new CourseSQLStorageProvider(configProvider): null 
    this.hotDB = !configProvider.elasticsearchURL() ? null : new CourseElasticsearchProvider(configProvider)
  }
  herarcialModules(context: Context, courseUUID: string): Promise<HerarcialModule[]> {
    return this.hotDB ? this.hotDB.herarcialModules(context, courseUUID) : this.coldDB.herarcialModules(context, courseUUID)
  }
  fetchCourses(context: Context, param: Param<CourseQueryParam>): Promise<Paginated<Course[]>> {
    return this.hotDB && this.hotDB.fetchCourses(context, param) || this.coldDB.fetchCourses(context, param)
  }
  getCourse(context: Context, courseUUID: string): Promise<Course> {
    if(this.hotDB) return this.hotDB.getCourse(context, courseUUID)
    return this.coldDB.getCourse(context, courseUUID)
  }
  checkCoursesLinkPath(context: Context, linkPath: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async createCourse(context: Context, course: Course): Promise<Course> {
    const uuid = UUID.v5(course.tutor + course.name, UUID.v5.URL)
    course.uuid = uuid
    const f: Promise<Course>[] = [this.coldDB.createCourse(context, course)]
    if(this.hotDB) f.push(this.hotDB.createCourse(context, course))
    const [ c ] = await Promise.all(f)
    return c
  }
  async updateCourse(context: Context, uuid: string, course: Course): Promise<Course> {
    const f: Promise<Course>[] = [this.coldDB.updateCourse(context, uuid, course)]
    if(this.hotDB) f.push(this.hotDB.updateCourse(context, uuid, course))
    const [ c ] = await Promise.all(f)
    return c
  }
  async deleteCourse(context: Context, uuid: string): Promise<Course> {
    const f: Promise<Course>[] = [this.coldDB.deleteCourse(context, uuid)]
    if(this.hotDB) f.push(this.hotDB.deleteCourse(context, uuid))
    const [ c ] = await Promise.all(f)
    return c
  }
  getResultCertificate(context: Context, courseUUID: string, certificateUUID: string): Promise<Certificate> {  
    if(this.hotDB) return this.hotDB.getResultCertificate(context, courseUUID, certificateUUID)
    return this.coldDB.getResultCertificate(context, courseUUID, certificateUUID)
  }
  fetchResultCertificate(context: Context, courseUUID: string): Promise<Certificate[]> {
    if(this.hotDB) return this.hotDB.fetchResultCertificate(context, courseUUID)
    return this.coldDB.fetchResultCertificate(context, courseUUID)
  }
  async updateResultCertificate(context: Context, courseUUID: string, certificateUUID: string, certificate: Certificate): Promise<Certificate> {
    const f: Promise<Certificate>[] = [this.coldDB.updateResultCertificate(context, courseUUID, certificateUUID, certificate)]
    if(this.hotDB) f.push(this.hotDB.updateResultCertificate(context, courseUUID, certificateUUID, certificate))
    await Promise.all(f)
    return certificate
  }
  async createResultCertificate(context: Context, courseUUID: string, certificate: Certificate): Promise<Certificate> {
    const uuid = UUID.v5(courseUUID + certificate.caption, UUID.v5.URL)
    certificate = {
      ...certificate,
      uuid,
    }
    const f: Promise<Certificate>[] = [this.coldDB.createResultCertificate(context, courseUUID, certificate)]
    if(this.hotDB) f.push(this.hotDB.createResultCertificate(context, courseUUID, certificate))
    await Promise.all(f)
    return certificate
  }
  async deleteResultCertificate(context: Context, courseUUID: string, certificateUUID: string): Promise<Certificate> {
    const f: Promise<Certificate>[] = [this.coldDB.deleteResultCertificate(context, courseUUID, certificateUUID)]
    if(this.hotDB) f.push(this.hotDB.deleteResultCertificate(context, courseUUID, certificateUUID))
    const [ c ] = await Promise.all(f)
    return c
  }
  fetchModules(context: any, courseUUID: string, parentModule?: string): Promise<Module[]> {
    if(this.hotDB) return this.hotDB.fetchModules(context, courseUUID, parentModule)
    return this.coldDB.fetchModules(context, courseUUID, parentModule)
  }
  getModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module> {
    if(this.hotDB) return this.hotDB.getModule(context, courseUUID, moduleUUID)
    return this.coldDB.getModule(context, courseUUID, moduleUUID)
  }
  checkModulesLinkPath(context: Context, linkPath: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async createModule(context: Context, courseUUID: string, module: Module): Promise<Module> {
    const uuid = UUID.v5(courseUUID + module.name, UUID.v5.URL)
    module.uuid = uuid
    const f: Promise<Module>[] = [this.coldDB.createModule(context, courseUUID, module)]
    if(this.hotDB) f.push(this.hotDB.createModule(context, courseUUID, module))
    const [ m ] = await Promise.all(f)
    return m
  }
  async updateModule(context: Context, courseUUID: string, moduleUUID: string, module: Module): Promise<Module> {
    const f: Promise<Module>[] = [this.coldDB.updateModule(context, courseUUID, moduleUUID, module)]
    if(this.hotDB) f.push(this.hotDB.updateModule(context, courseUUID, moduleUUID, module))
    const [ m ] = await Promise.all(f)
    return m
  }
  async deleteModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module> {
    const f: Promise<Module>[] = [this.coldDB.deleteModule(context, courseUUID, moduleUUID)]
    if(this.hotDB) f.push(this.hotDB.deleteModule(context, courseUUID, moduleUUID))
    const [ m ] = await Promise.all(f)
    return m
  }
  getModuleQuiz(context: any, courseUUID: string, moduleUUID: string): Promise<Quiz> {
    if(this.hotDB) return this.hotDB.getModuleQuiz(context, courseUUID, moduleUUID)
    return this.coldDB.getModuleQuiz(context, courseUUID, moduleUUID)
  }
  async createModuleQuiz(context: Context, courseUUID: string, moduleUUID: string, quiz: Quiz): Promise<Quiz> {
    const uuid = UUID.v5(moduleUUID + quiz.name, UUID.v5.URL)
    quiz.uuid = uuid
    const f: Promise<Quiz>[] = [this.coldDB.createModuleQuiz(context, courseUUID, moduleUUID, quiz)]
    if(this.hotDB) f.push(this.hotDB.createModuleQuiz(context, courseUUID, moduleUUID, quiz))
    const [ q ] = await Promise.all(f)
    return q
  }
  async updateModuleQuiz(context: Context, courseUUID: string, moduleUUID: string, quiz: Quiz): Promise<Quiz> {
    const f: Promise<Quiz>[] = [this.coldDB.updateModuleQuiz(context, courseUUID, moduleUUID, quiz)]
    if(this.hotDB) f.push(this.hotDB.updateModuleQuiz(context, courseUUID, moduleUUID, quiz))
    const [ m ] = await Promise.all(f)
    return m
  }
  async deleteModuleQuiz(context: Context, courseUUID: string, moduleUUID: string): Promise<Quiz> {
    const f: Promise<Quiz>[] = [this.coldDB.deleteModuleQuiz(context, courseUUID, moduleUUID)]
    if(this.hotDB) f.push(this.hotDB.deleteModuleQuiz(context, courseUUID, moduleUUID))
    const [ m ] = await Promise.all(f)
    return m
  }
  fetchModuleQuizQuestions(context: any, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Question[]> {
    if(this.hotDB) return this.hotDB.fetchModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID)
    return this.coldDB.fetchModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID)
  }
  getModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Question> {
    if(this.hotDB) return this.hotDB.getModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID)
    return this.coldDB.getModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID)
  }
  async createModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, question: Question): Promise<Question> {
    const uuid = UUID.v5(quizUUID + question.question, UUID.v5.URL)
    question.uuid = uuid    
    const f: Promise<Question>[] = [this.coldDB.createModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, question)]
    if(this.hotDB) f.push(this.hotDB.createModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, question))
    const [ q ] = await Promise.all(f)
    return q 
  }
  async updateModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, question: Question): Promise<Question> {
    const f: Promise<Question>[] = [this.coldDB.updateModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID, question)]
    if(this.hotDB) f.push(this.hotDB.updateModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID, question))
    const [ m ] = await Promise.all(f)
    return m
  }
  async deleteModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Question> {
    const f: Promise<Question>[] = [this.coldDB.deleteModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID)]
    if(this.hotDB) f.push(this.hotDB.deleteModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID))
    const [ m ] = await Promise.all(f)
    return m
  }
  fetchModuleQuizQuestionOptions(context: any, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Options[]> {
    if(this.hotDB) return this.hotDB.fetchModuleQuizQuestionOptions(context, courseUUID, moduleUUID, quizUUID, questionUUID)
    return this.coldDB.fetchModuleQuizQuestionOptions(context, courseUUID, moduleUUID, quizUUID, questionUUID)
  }
  async updateModuleQuizQuestionOptions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, options: Options[]): Promise<Options[]> {
    const f: Promise<Options[]>[] = [this.coldDB.updateModuleQuizQuestionOptions(context, courseUUID, moduleUUID, quizUUID, questionUUID, options)]
    if(this.hotDB) f.push(this.hotDB.updateModuleQuizQuestionOptions(context, courseUUID, moduleUUID, quizUUID, questionUUID, options))
    const [ m ] = await Promise.all(f)
    return m
  }
  
}
export default CourseStorageProvider