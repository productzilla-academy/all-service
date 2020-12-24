import CourseManager, { Certificate, Course, CourseQueryParam, Module, Options, Param, Question, Quiz } from "../../../../core/courses"
import Context from "../../../../context"
import { Paginated } from "../../../../core/core.types"
import SQLConnection, { tables } from "../../drivers/sql/connection"
import ConfigProvider from "../../../../config"
import * as knex from "knex"
import { INDEX_TABLE_CAREERS } from "../../../careers"
import { NotFoundError } from "../../../../errors"
import UUID from 'uuid'
import { to } from 'await-to-js'
import { INDEX_TABLE_COURSES, INDEX_TABLE_MODULES } from "../../../courses"
import { create } from "domain"
export default class CourseSQLStorageProvider implements CourseManager {
  configProvider: ConfigProvider
  courseDB: knex.QueryBuilder<Course, Course[]>
  modulesDB: knex.QueryBuilder<Module, Module[]>
  certificateDB: knex.QueryBuilder<Certificate, Certificate[]>
  quizQuestionDB: knex.QueryBuilder<Question, Question[]>
  quizQuestionOptionsDB: knex.QueryBuilder<Options, Options[]>
  quizDB: knex.QueryBuilder<Quiz, Quiz[]>
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.courseDB = SQLConnection(configProvider)(tables.INDEX_TABLE_COURSES)
    this.modulesDB = SQLConnection(configProvider)(tables.INDEX_TABLE_MODULES)
    this.certificateDB = SQLConnection(configProvider)(tables.INDEX_TABLE_RESULT_CERTIFICATE)
    this.quizDB = SQLConnection(configProvider)(tables.INDEX_TABLE_QUIZ)
    this.quizQuestionDB = SQLConnection(configProvider)(tables.INDEX_TABLE_QUESTIONS)
    this.quizQuestionOptionsDB = SQLConnection(configProvider)(tables.INDEX_TABLE_QUESTION_OPTIONS)
  }
  async fetchCourses(context: Context, param: Param<CourseQueryParam>): Promise<Paginated<Course[]>> {
    let courseDB = this.courseDB
    if(param.search.level) courseDB = courseDB.whereIn(`level`, function() {
      this.select(`id`).from(INDEX_TABLE_CAREERS).where(`name`, `like`, `%${param.search.level}%`)
    }).orderBy(`number`, `asc`)
    if(param.search.tutor) courseDB = courseDB.where(`tutor`, `like`, `%${param.search.tutor}%`)
    const courses = await courseDB.limit(param.pagination.size).offset((param.pagination.page - 1) * param.pagination.size)
    const t = await courseDB.count<Record<string, number>>('name')
    const total_size = t[0]['count(`name`)']
    const page = param.pagination.page
    return {
      data: courses,
      pagiation: {
        page,
        total_size,
        size: param.pagination.size,
        total_page: Math.round(total_size / page)
      }
    }
  }
  async getCourse(context: Context, courseUUID: string): Promise<Course> {
    let [course] = await this.courseDB.where({ uuid: courseUUID})
    if(!course) throw NotFoundError(`Career not found`)
    return course
  }
  async checkCoursesLinkPath(context: Context, linkPath: string): Promise<void> {
    
  }
  async createCourse(context: Context, course: Course): Promise<Course> {
    const uuid = UUID.v5(course.tutor, UUID.v5.URL)
    course.uuid = uuid
    course.resources = undefined
    await this.courseDB.insert(course)
    return course
  }
  async updateCourse(context: Context, uuid: string, course: Course): Promise<Course> {
    await this.getCourse(context, uuid)
    await this.courseDB.update({ ...course }).where({ uuid })
    return course
  }
  async deleteCourse(context: Context, uuid: string): Promise<Course> {
    const course = await this.getCourse(context, uuid)
    await this.courseDB.delete().where({ uuid })
    return course
  }
  
  async getResultCertificate(context: Context, courseUUID: string): Promise<Certificate> {
    const course = await this.getCourse(context, courseUUID)
    const [certificate] = await this.certificateDB.where({course: course.id as any as Course})
    if(!certificate) throw NotFoundError(`Certificate not setted for this course`)
    return {
      ...certificate,
      course
    }
  }
  async createResultCertificate(context: Context, courseUUID: string, certificate: Certificate): Promise<Certificate> {
    const [err, existingCertificate] = await to(this.getResultCertificate(context, courseUUID))
    if(err) {
      const course = await this.getCourse(context, courseUUID)
      const uuid = UUID.v5(course.tutor, UUID.v5.URL)
      certificate = {
        ...certificate,
        uuid,
        course: course.id as any as Course
      }
      await this.certificateDB.insert(certificate) 
      return certificate 
    } else {
      await this.certificateDB.update({
        ...existingCertificate,
        ...certificate
      }).where({ id: existingCertificate.id })  
      return {
        ...existingCertificate,
        ...certificate
      }
    }
  }
  async deleteResultCertificate(context: Context, courseUUID: string): Promise<Certificate> {
    const certificate = await this.getResultCertificate(context, courseUUID)
    await this.certificateDB.delete().where({ id: certificate.id })
    return certificate
  }
  
  async fetchModules(context, courseUUID: string, parentModule?: string): Promise<Module[]> {
    const modules = await this.modulesDB.whereIn(`course`, function() {
      this.select(`id`).from(INDEX_TABLE_COURSES).where({
        uuid: courseUUID
      })
    })
    if(modules.length === 0) throw NotFoundError(`Modules not found`)
    return modules
  }
  async getModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module> {
    const modules = await this.modulesDB.whereIn(`course`, function() {
      this.select(`id`).from(INDEX_TABLE_COURSES).where({
        uuid: courseUUID
      })
    }).where({
      uuid: moduleUUID
    })
    if(modules.length === 0) throw NotFoundError(`Modules not found`)
    return module[0]
  }
  async checkModulesLinkPath(context: Context, linkPath: string): Promise<void> {

  }
  async createModule(context: Context, courseUUID: string, module: Module): Promise<Module> {
    const course = await this.getCourse(context, courseUUID)
    const uuid = UUID.v5(course.tutor, UUID.v5.URL)
    module.uuid = uuid
    await this.modulesDB.insert(module)
    return module
  }
  async updateModule(context: Context, courseUUID: string, moduleUUID: string, module: Module): Promise<Module> {
    let existingModule = await this.getModule(context, courseUUID, moduleUUID)
    existingModule = {
      ...existingModule,
      ...module
    }
    await this.modulesDB.update(existingModule).where({uuid: moduleUUID})
    return existingModule
  }
  async deleteModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module> {
    const module = await this.getModule(context, courseUUID, moduleUUID)
    await this.modulesDB.del().whereIn(`course`, function() {
      this.select(`id`).from(INDEX_TABLE_COURSES).where({
        uuid: courseUUID
      })
    }).where({
      uuid: moduleUUID
    })
    return module
  }
  
  async getModuleQuiz(context, courseUUID: string, moduleUUID: string): Promise<Quiz> {
    const [quiz] = await this.quizDB.whereIn(`module`, function() {
      this.select(`id`).from(INDEX_TABLE_MODULES).where({
        uuid: moduleUUID
      }).whereIn(`course`, function(){
        this.select(`id`).from(INDEX_TABLE_COURSES).where({
          uuid: courseUUID
        })
      })
    })
    if(!quiz) throw NotFoundError(`Quiz not found`)
    quiz.module = await this.getModule(context, courseUUID, moduleUUID)
    
    const [e, questions] = await to(this.fetchModuleQuizQuestions(context, courseUUID, moduleUUID, quiz.uuid))
    return {
      ...quiz,
      questions
    }
  }
  async createModuleQuiz(context: Context, courseUUID: string, moduleUUID:string, quiz: Quiz): Promise<Quiz> {
    const module = await this.getModule(context, courseUUID, moduleUUID)
    const [err] = await to(this.getModuleQuiz(context, courseUUID, moduleUUID))
    if(err) {
      const uuid = UUID.v5(module.course.tutor, UUID.v5.URL)
      quiz.uuid = uuid
      await this.quizDB.insert(quiz)  
      return quiz
    }
    return await this.updateModuleQuiz(context, courseUUID, moduleUUID, quiz)
  }
  async updateModuleQuiz(context: Context, courseUUID: string, moduleUUID: string, quiz: Quiz): Promise<Quiz> {
    const existingQuiz = await this.getModuleQuiz(context, courseUUID, moduleUUID)
    const updatedQuiz = {
      ...existingQuiz,
      ...quiz
    }
    await this.quizDB.update(updatedQuiz).where({id: existingQuiz.id})
    return updatedQuiz
  }
  async deleteModuleQuiz(context: Context, courseUUID: string, moduleUUID: string): Promise<Quiz> {
    const existingQuiz = await this.getModuleQuiz(context, courseUUID, moduleUUID)
    await this.quizDB.del().where({ id: existingQuiz.id })
    return existingQuiz
  }

  async fetchModuleQuizQuestions(context, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Question[]> {
    let questions = await this.quizQuestionDB.whereIn(`quiz`, function(){
      this.select(`id`).from(tables.INDEX_TABLE_QUIZ).where({
        uuid: quizUUID
      }).whereIn(`module`, function() {
        this.select(`id`).from(tables.INDEX_TABLE_MODULES).where({ uuid: moduleUUID })
      })
    })
    for(const p in questions){
      let e: Error
      [e, questions[p].options] = await to(this.fetchModuleQuizQuestionOptions(context, courseUUID, moduleUUID, quizUUID, questions[p].uuid))
      questions[p].answer = undefined
    }
    return questions
  }

  async getModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Question> {

  }
  async createModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, question: Question): Promise<Question> {

  }
  async updateModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, question: Question): Promise<Question> {

  }
  async deleteModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, question: Question): Promise<Question> {

  }
  async fetchModuleQuizQuestionOptions(context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Options[]> {

  }
  async updateModuleQuizQuestionOptions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, options: Options): Promise<Options[]> {

  }
} 