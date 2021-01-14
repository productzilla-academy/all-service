import { Certificate, Course, CourseQueryParam, CourseStorageManager, HerarcialModule, Module, Options, Question, QuestionType, Quiz } from '../../../../core/courses'
import Context from '../../../../context'
import { Paginated, Param } from '../../../../core/core.types'
import SQLConnection, { tables } from '../../../storage/drivers/sql/connection'
import ConfigProvider from '../../../../config'
import * as knex from 'knex'
import { BadRequestError, NotFoundError, PrecondtionError } from '../../../../errors'
import { to } from 'await-to-js'
import CareerSQLProvider from '../../../careers/storage/sql/careers.sql.storage.provider'
import { Level } from '../../../../core/careers'

export default class CourseSQLStorageProvider implements CourseStorageManager {
  configProvider: ConfigProvider
  DB: knex.QueryBuilder
  careerDB: CareerSQLProvider
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.careerDB = new CareerSQLProvider(configProvider)
  }
  courseDB(){
    return SQLConnection(this.configProvider)(tables.INDEX_TABLE_COURSES)
  }
  modulesDB() {
    return SQLConnection(this.configProvider)(tables.INDEX_TABLE_MODULES)
  } 
  certificateDB() {
    return SQLConnection(this.configProvider)(tables.INDEX_TABLE_RESULT_CERTIFICATE)
  } 
  quizDB() {
    return SQLConnection(this.configProvider)(tables.INDEX_TABLE_QUIZ)
  } 
  quizQuestionDB() {
    return SQLConnection(this.configProvider)(tables.INDEX_TABLE_QUESTIONS)
  } 
  quizQuestionOptionsDB() {
    return SQLConnection(this.configProvider)(tables.INDEX_TABLE_QUESTION_OPTIONS)
  } 
  async fetchCourses(context: Context, param?: Param<CourseQueryParam>): Promise<Paginated<Course[]>> {
    let courseDB = this.courseDB().select(
      `${tables.INDEX_TABLE_COURSES}.uuid`,
      `${tables.INDEX_TABLE_COURSES}.tutor`, 
      `${tables.INDEX_TABLE_COURSES}.open`, 
      `${tables.INDEX_TABLE_COURSES}.name`, 
      `${tables.INDEX_TABLE_COURSES}.number`, 
      `${tables.INDEX_TABLE_COURSES}.status`,
      `${tables.INDEX_TABLE_COURSES}.description`,
      `${tables.INDEX_TABLE_LEVELS}.uuid as level_uuid`,
      `${tables.INDEX_TABLE_LEVELS}.name as level_name`,
      `${tables.INDEX_TABLE_CAREERS}.name as career_name`,
      )
      .join(tables.INDEX_TABLE_LEVELS, `${tables.INDEX_TABLE_COURSES}.level`, `=`, `${tables.INDEX_TABLE_LEVELS}.id`)
      .join(tables.INDEX_TABLE_CAREERS, `${tables.INDEX_TABLE_LEVELS}.career`, `=`, `${tables.INDEX_TABLE_CAREERS}.id`)
    
    courseDB = param && param.search && param.search.level && courseDB.where(`${tables.INDEX_TABLE_LEVELS}.uuid`, '=', `${param.search.level}`) || courseDB

    courseDB = param && param.search && param.search.tutor && courseDB.where(`tutor`, `like`, `%${param.search.tutor}%`) || courseDB
    const courses =  await courseDB
    
    const t = await courseDB.clone().clearSelect().count<Record<string, number>>(`${tables.INDEX_TABLE_COURSES}.name`)

    const page = param && param.pagination && param.pagination.page || 1 
    
    const size = param && param.pagination && param.pagination.size || 10
    courseDB = courseDB.limit(size).offset((page - 1) * size)
    
    const total_size = t[0][`count(\`${tables.INDEX_TABLE_COURSES}\`.\`name\`)`]
    
    const res: Course[] = []
    for (const i in courses) {
      const element = courses[i]
      res.push({
        created: element.created,
        description: element.description,
        uuid: element.uuid,
        number: element.number,
        status: element.status,
        name: element.name,
        tutor: element.tutor,
        open: element.open
      })
    }
    return {
      data: res,
      pagination: {
        page,
        total_size,
        size: size,
        total_page: Math.ceil(total_size / size)
      }
    }
  }
  async getCourse(context: Context, courseUUID: string): Promise<Course> {
    let [course] = await this.courseDB().select(
      `${tables.INDEX_TABLE_COURSES}.*`,
      `${tables.INDEX_TABLE_LEVELS}.uuid as level_uuid`,
      `${tables.INDEX_TABLE_LEVELS}.name as level_name`,
      `${tables.INDEX_TABLE_CAREERS}.name as career_name`,
      )
      .join(tables.INDEX_TABLE_LEVELS, `level`, `=`, `${tables.INDEX_TABLE_LEVELS}.id`)
      .join(tables.INDEX_TABLE_CAREERS, `${tables.INDEX_TABLE_LEVELS}.career`, `=`, `${tables.INDEX_TABLE_CAREERS}.id`)
      .where(`${tables.INDEX_TABLE_COURSES}.uuid`, courseUUID)
    if(!course) throw NotFoundError(`Course not found`)
    
    const c: Course = {
      description: course.description,
      name: course.name,
      open: course.open,
      number: course.number,
      status: course.status,
      tutor: course.tutor,
      uuid: course.uuid,
      created: course.created,
      overview: course.overview,
      updated: course.updated,
      link_path: course.link_path,
      id: course.id
    }
    return c
  }
  async checkCoursesLinkPath(context: Context, linkPath: string): Promise<void> {
    
  }
  async createCourse(context: Context, course: Course): Promise<Course> {
    const level = await this.careerDB.getCareerLevel(context, course.level.uuid)
    course.level = level.id as any as Level
    await this.courseDB().insert(course)
    course.level = level
    return course
  }
  async updateCourse(context: Context, uuid: string, course: Course): Promise<Course> {
    await this.getCourse(context, uuid)
    if(course.level) {
      const level = await this.careerDB.getCareerLevel(context, course.level.uuid)
      course.level = level.id as any as Level
    }
    await this.courseDB().update({ ...course }).where({ uuid })
    return course
  }
  async deleteCourse(context: Context, uuid: string): Promise<Course> {
    const course = await this.getCourse(context, uuid)
    await this.courseDB().delete().where({ uuid })
    return course
  }
  
  async fetchResultCertificate(context: Context, courseUUID: string): Promise<Certificate[]> {
    const certificates = await this.certificateDB()
      .select(
        `${tables.INDEX_TABLE_RESULT_CERTIFICATE}.uuid`,
        `${tables.INDEX_TABLE_RESULT_CERTIFICATE}.caption`,
        `${tables.INDEX_TABLE_RESULT_CERTIFICATE}.weight_goal`,
        `${tables.INDEX_TABLE_RESULT_CERTIFICATE}.uuid`,
        `${tables.INDEX_TABLE_RESULT_CERTIFICATE}.created`,
        `${tables.INDEX_TABLE_RESULT_CERTIFICATE}.updated`,
        `${tables.INDEX_TABLE_COURSES}.name as course_name`,
        `${tables.INDEX_TABLE_COURSES}.description as course_description`,
        `${tables.INDEX_TABLE_COURSES}.uuid as course_uuid`
        )
        .join(tables.INDEX_TABLE_COURSES, `${tables.INDEX_TABLE_RESULT_CERTIFICATE}.course`, '=', `${tables.INDEX_TABLE_COURSES}.id`)
        .where(`${tables.INDEX_TABLE_COURSES}.uuid`, '=', courseUUID)

    if(certificates.length === 0) throw NotFoundError(`Certificate not setted for this course`)
    const result: Certificate[] = []
    for (const i in certificates) {
      const element = certificates[i]
      result.push({
        uuid: element.uuid,
        caption: element.caption,
        created: element.created,
        updated: element.updated,
        course: {
          description: element.course_description,
          uuid: element.course_uuid,
          name: element.course_name
        } as Course,
        weight_goal: element.weight_goal
      } as Certificate)
       
    }
    return result
  }
  async getResultCertificate(context: Context, courseUUID: string, certificateUUID: string): Promise<Certificate> {
    const [certificate] = await this.certificateDB()
      .select(
        `${tables.INDEX_TABLE_RESULT_CERTIFICATE}.*`,
        `${tables.INDEX_TABLE_COURSES}.name as course_name`,
        `${tables.INDEX_TABLE_COURSES}.description as course_description`,
        `${tables.INDEX_TABLE_COURSES}.uuid as course_uuid`
        )
        .join(tables.INDEX_TABLE_COURSES, `${tables.INDEX_TABLE_RESULT_CERTIFICATE}.course`, '=', `${tables.INDEX_TABLE_COURSES}.id`)
        .where(`${tables.INDEX_TABLE_RESULT_CERTIFICATE}.uuid`, '=', certificateUUID)
    if(!certificate) throw NotFoundError(`Certificate not setted for this course`)
    return {
      id: certificate.id,
      uuid: certificate.uuid,
      caption: certificate.caption,
      weight_goal: certificate.weight_goal,
      format: certificate.format,
      created: certificate.created,
      updated: certificate.updated,
      course: {
        uuid: certificate.course_uuid,
        name: certificate.course_name,
        description: certificate.course_description
      } as Course
    }
  }
  async createResultCertificate(context: Context, courseUUID: string, certificate: Certificate): Promise<Certificate> {
    const course = await this.getCourse(context, courseUUID)
    await this.certificateDB().insert({
      ...certificate,
      course: course.id
    })
    
    return {
      ...certificate,
      course: course
    }
  }
  async updateResultCertificate(context: Context, courseUUID: string, certificateUUID: string, certificate: Certificate): Promise<Certificate> {

    await this.certificateDB().insert(certificate)
    await this.certificateDB().update({
      ...certificate
    }).where({ uuid: certificateUUID })
    certificate = await this.getResultCertificate(context, courseUUID, certificateUUID)
    return {
      ...certificate
    }
  }
  async deleteResultCertificate(context: Context, courseUUID: string, certificateUUID: string): Promise<Certificate> {
    const certificate = await this.getResultCertificate(context, courseUUID, certificateUUID)
    await this.certificateDB().delete().where({ id: certificate.id })
    return certificate
  }
  
  async fetchModules(context, courseUUID: string, parentModule?: string): Promise<Module[]> {
    let mDB = SQLConnection(this.configProvider)
    .select(
      'name', 
      'uuid',
      SQLConnection(this.configProvider)
      .from(tables.INDEX_TABLE_MODULES)
      .count('uuid')
      .whereRaw(`parent_module = m1.id`).as(`sub_modules_count`)
    )
    .from(`${tables.INDEX_TABLE_MODULES} as m1`)
    .whereIn(`course`, function() {
      this.select(`id`).from(tables.INDEX_TABLE_COURSES).where({
        uuid: courseUUID
      })
    })
    mDB = !parentModule ? mDB.where({ parent_module: null }) : mDB.whereIn(`parent_module`, function(){
      this.select(`id`).from(tables.INDEX_TABLE_MODULES).where({ uuid: parentModule })
    })
    let modules = await mDB
    return modules
  }
  async herarcialModules(context: Context, courseUUID: string): Promise<HerarcialModule[]> {
    const getChild = async (context: Context, modules: Module[]): Promise<HerarcialModule[]> => {
      const p = []
      const index: number[] = []
      const h: HerarcialModule[] = []
      for (let i = 0; i< modules.length ; i++) {
          const element = modules[i]
          if (element.sub_modules_count) {
            index.push(i)
            p.push(this.fetchModules(context, courseUUID, element.uuid))
          }
          h.push({
            name: element.name,
            uuid: element.uuid,
            sub_modules: element.sub_modules_count ? [] : null 
          })
      }
      
      const s = await Promise.all(p)
      for (let i = 0; i < s.length; i++) {
        const element = s[i];
        const c = await getChild(context, element)
        h[index[i]].sub_modules.push(
            ...c
        )
      }
      return h
    }
    let m = await this.fetchModules(context, courseUUID)
    const h = getChild(context, m)    
    return h
  }
  async getModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module> {
    const [module] = 
    await this.modulesDB()
    .select(
      `${tables.INDEX_TABLE_MODULES}.*`,
      `${tables.INDEX_TABLE_COURSES}.uuid as course_uuid`,
      `${tables.INDEX_TABLE_COURSES}.name as course_name`,
      `${tables.INDEX_TABLE_COURSES}.tutor`,
      )
    .join(tables.INDEX_TABLE_COURSES, `${tables.INDEX_TABLE_MODULES}.course`, '=', `${tables.INDEX_TABLE_COURSES}.id`)
    .where(`${tables.INDEX_TABLE_MODULES}.uuid`, moduleUUID)
    .where(`${tables.INDEX_TABLE_COURSES}.uuid`, courseUUID)
    if(!module) throw NotFoundError(`Modules not found`)
    return {
      ...module,
      course: {
        tutor: module.tutor,
        name: module.course_name,
        uuid: module.course_uuid
      },
      tutor: undefined,
      course_name: undefined,
      course_uuid: undefined
    }
  }
  async checkModulesLinkPath(context: Context, linkPath: string): Promise<void> {

  }
  async createModule(context: Context, courseUUID: string, module: Module): Promise<Module> {
    const course = await this.getCourse(context, courseUUID)
    module.course = course.id as any as Course
    let [e, pModule] = [null, null]
    if(module.parent_module){
      [e, pModule] = await to(this.getModule(context, courseUUID, module.parent_module.uuid))
      if (e) throw NotFoundError(`Parent module not found`)
      module.parent_module = pModule.id as any as Module 
    }
    await this.modulesDB().insert(module)
    return {
      ...module,
      course: course,
      parent_module: pModule
    }
  }
  async updateModule(context: Context, courseUUID: string, moduleUUID: string, module: Module): Promise<Module> {
    let existingModule = await this.getModule(context, courseUUID, moduleUUID)
    const course = existingModule.course

    existingModule = {
      ...existingModule,
      ...module,
      course: course.id as any as Course
    }
    
    await this.modulesDB().update(existingModule).where({uuid: moduleUUID})
    return {
      ...existingModule,
      course
    }
  }
  async deleteModule(context: Context, courseUUID: string, moduleUUID: string): Promise<Module> {
    const module = await this.getModule(context, courseUUID, moduleUUID)
    await this.modulesDB().del().whereIn(`course`, function() {
      this.select(`id`).from(tables.INDEX_TABLE_COURSES).where({
        uuid: courseUUID
      })
    }).where({
      uuid: moduleUUID
    })
    return module
  }
  
  async getModuleQuiz(context, courseUUID: string, moduleUUID: string): Promise<Quiz> {
    const [quiz] = await this.quizDB().whereIn(`module`, function() {
      this.select(`id`).from(tables.INDEX_TABLE_MODULES).where({
        uuid: moduleUUID
      }).whereIn(`course`, function(){
        this.select(`id`).from(tables.INDEX_TABLE_COURSES).where({
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
      quiz.module = module.id as any as Module
      await this.quizDB().insert(quiz)  
      return quiz
    }
    return await this.updateModuleQuiz(context, courseUUID, moduleUUID, quiz)
  }
  async updateModuleQuiz(context: Context, courseUUID: string, moduleUUID: string, quiz: Quiz): Promise<Quiz> {
    const existingQuiz = await this.getModuleQuiz(context, courseUUID, moduleUUID)
    const updatedQuiz = {
      ...existingQuiz,
      ...quiz,
      module: existingQuiz.module.id as any as Module,
    }
    delete updatedQuiz.questions
    await this.quizDB().update(updatedQuiz).where({id: existingQuiz.id})
    return {
      ...existingQuiz,
      ...quiz
    }
  }
  async deleteModuleQuiz(context: Context, courseUUID: string, moduleUUID: string): Promise<Quiz> {
    const existingQuiz = await this.getModuleQuiz(context, courseUUID, moduleUUID)
    await this.quizDB().del().where({ id: existingQuiz.id })
    return existingQuiz
  }

  async fetchModuleQuizQuestions(context, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Question[]> {

    let questions = await this.quizQuestionDB().whereIn(`quiz`, function(){
      this.select(`id`).from(tables.INDEX_TABLE_QUIZ).where({
        uuid: quizUUID
      }).whereIn(`module`, function() {
        this.select(`id`).from(tables.INDEX_TABLE_MODULES).where({ uuid: moduleUUID })
      })
    })

    for(const p in questions){
      let e: Error
      if(questions[p].type === QuestionType.MULTIPLE_CHOISE)
        [e, questions[p].options] = await to(this.fetchModuleQuizQuestionOptions(context, courseUUID, moduleUUID, quizUUID, questions[p].uuid))
    }
    return questions
  }

  async getModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Question> {
    let [question] = 
      await this.quizQuestionDB().where({ uuid: questionUUID })
        .whereIn(`quiz`, function() {
          this.select(`id`)
            .from(tables.INDEX_TABLE_QUIZ)
            .where({ uuid: quizUUID })
            .whereIn(`module`, function(){
              this.select(`id`)
                .from(tables.INDEX_TABLE_MODULES)
                .where({ uuid: moduleUUID })
                .whereIn(`course`, function(){
                  this.select(`id`).from(tables.INDEX_TABLE_COURSES)
                    .where({ uuid: courseUUID })
                })
            })
        })
    if(!question) throw NotFoundError(`Question not found`)
    let e: Error
    if(question.type === QuestionType.MULTIPLE_CHOISE) 
      [e, question.options] = await to(this.fetchModuleQuizQuestionOptions(context, courseUUID, moduleUUID, quizUUID, questionUUID))
    return question
  }

  async createModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, question: Question): Promise<Question> {
    const quiz = await this.getModuleQuiz(context, courseUUID, moduleUUID)
    if(quizUUID !== quiz.uuid) throw NotFoundError(`Quiz not found`)
    await this.quizQuestionDB().insert({...question, quiz: quiz.id})
    return question
  }
  async updateModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, question: Question): Promise<Question> {
    const existingQuestion = await this.getModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID)
    let updatedQuestion = {
      ...existingQuestion,
      ...question
    }
    await this.quizQuestionDB().update(updatedQuestion).where({ id: existingQuestion.id })
    return question
  }
  async deleteModuleQuizQuestions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Question> {
    const existingQuestion = await this.getModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID)
    await this.quizQuestionDB().del().where({ id: existingQuestion.id })
    return existingQuestion
  }
  async fetchModuleQuizQuestionOptions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string): Promise<Options[]> {
    const options = await this.quizQuestionOptionsDB()
      .whereIn(`question`, function (){
        this
        .select(`id`)
        .from(tables.INDEX_TABLE_QUESTIONS)
        .where(`uuid`, '=', questionUUID)
        .whereIn(`module`, function(){
          this
          .select(`id`)
          .from(tables.INDEX_TABLE_MODULES)
          .where(`uuid`, `=`, moduleUUID)
          .whereIn(`course`, function(){
            this
            .select(`id`)
            .from(tables.INDEX_TABLE_COURSES)
            .where(`uuid`, '=', courseUUID)
          })
        })
      })
    if(options.length === 0) throw NotFoundError(`Options not setted`)
    return options
  }
  async updateModuleQuizQuestionOptions(context: Context, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, options: Options[]): Promise<Options[]> {
    const question = await this.getModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID)
    if(question.type !== QuestionType.MULTIPLE_CHOISE) throw PrecondtionError(`Question type is not MULTIPLE_CHOOISE: ${QuestionType.MULTIPLE_CHOISE}`)
    let o = []
    for (const p in options) {
      for (const k in o) {
        if(options[p].label === o[k].label) throw BadRequestError(`Options label must be unique`)
      }
      o.push({
        ...options[p],
        question: question.id
      })
    }
    await this.quizQuestionOptionsDB().insert(o)
    return options
  }
}