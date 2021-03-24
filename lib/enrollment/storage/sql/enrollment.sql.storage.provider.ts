import to from "await-to-js";
import { Transaction } from "knex";
import ConfigProvider from "../../../../config";
import Context from "../../../../context";
import { PaginationParam, Paginated } from "../../../../core/core.types";
import { Course, CourseStorageManager, HerarcialModule, Module } from "../../../../core/courses";
import Quiz from "../../../../core/courses/course.quiz";
import { Question, QuestionType } from "../../../../core/courses/course.quiz.questions";
import { Student, Enrollment } from "../../../../core/enrollment/enroll";
import { EnrollmentStorageManager } from "../../../../core/enrollment/enrollment.manager";
import { HerarcialModuleProcess, LearnProcess, ModuleProcess } from "../../../../core/enrollment/learn.process";
import { Answer, QuizResult } from "../../../../core/enrollment/quiz.result";
import { BadRequestError, DuplicateError, InternalServerError, NotFoundError, PrecondtionError } from "../../../../errors";
import CourseSQLStorageProvider from "../../../courses/storage/sql";
import Connection, { tables } from "../../../storage/drivers/sql/connection"
export class EnrollmentSQLStorageProvider implements EnrollmentStorageManager {
  configProvider: ConfigProvider
  private courseProvider: CourseSQLStorageProvider
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.courseProvider = new CourseSQLStorageProvider(configProvider)
  }
  private enrollmentDB(){
    return Connection(this.configProvider)(tables.INDEX_TABLE_ENROLLMENTS)
  }
  private quizAnswerDB(){
    return Connection(this.configProvider)(tables.INDEX_TABLE_QUIZ_ANSWER)
  }
  private learnProcessDB(){
    return Connection(this.configProvider)(tables.INDEX_TABLE_LEARN_PROCESS)
  }
  async enroll(context: Context, student: Student, courseUUID: string, open: Date, expire?: Date): Promise<void> {
    const [err] = await to(this.getEnrollment(context, student, courseUUID))
    if(!err) throw DuplicateError(`Already enrolled`)
    const db = this.enrollmentDB()
    const c = await this.courseProvider.getCourse(context, courseUUID)
    await db.insert({
      student: student.username,
      open,
      course: c.id,
      expire
    })
    const modules = await this.courseProvider.modulesDB().select(`id`)
    .whereIn(`course`, function() {
      this.select(`id`).from(tables.INDEX_TABLE_COURSES).where({
        uuid: courseUUID
      })
    })
    const data = []
    for (let i = 0; i < modules.length; i++) {
      const element = modules[i]
      const isFirst = i === 0
      data.push({
        progress: 0, student: student.username, module: element.id, active: isFirst
      })
    }
    await this.learnProcessDB()
    .insert(data)

  }
  async fetchEnrollment(context: Context, student: Student, pagination?: PaginationParam): Promise<Paginated<Enrollment>> {
    let [
      page, size
     ] = [
       pagination.page || 1,
       pagination.size || 10
     ]
     const data = await 
     this.enrollmentDB()
      .select(
        `${tables.INDEX_TABLE_ENROLLMENTS}.*`,
        `${tables.INDEX_TABLE_COURSES}.uuid as course_uuid`,
        `${tables.INDEX_TABLE_COURSES}.name as course_name`,
        )
      .join(tables.INDEX_TABLE_COURSES, `course` ,`${tables.INDEX_TABLE_COURSES}.id`)
      .where(`${tables.INDEX_TABLE_ENROLLMENTS}.student`, student.username )
      .limit(size)
      .offset((page - 1) * size)
    if(data.length === 0) throw NotFoundError(`No enrollment with that data`)
    const count = await 
    this.enrollmentDB()
     .count(`id`).as(`count_of_enrollment`)
     .where(`${tables.INDEX_TABLE_ENROLLMENTS}.student`, student.username )
    const total_size = count[`count_of_enrollment`]
    const total_page = Math.ceil(total_size / size)
    const enrollments: Enrollment[] = []
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        enrollments.push({
          course: {
            name: element.course_name,
            uuid: element.course_uuid
          } as Course,
          open: element.open,
          student: {
            username: element.student
          },
          created: element.created,
          updated: element.updated,
          progress: element.progress
        })
      }
    }
    return {
      data: enrollments,
      pagination: {
        page,
        size,
        total_page,
        total_size
      }
    }
  }
  async getEnrollment(context: Context, student: Student, courseUUID: string): Promise<Enrollment> {
    const db = this.enrollmentDB()
    const [course, [certificate], [en]] = await Promise.all([
      this.courseProvider.getCourse(context, courseUUID),
      this.courseProvider.fetchResultCertificate(context, courseUUID),
      db.where({ student: student.username }).whereIn(`course`, function() {
        this.select(`id`).from(tables.INDEX_TABLE_COURSES).where({uuid: courseUUID})
      })
    ])
    if(!en) throw NotFoundError(`No enrollment with that data`)
    return {
      ...en,
      course,
      finished: certificate.weight_goal <= en.progress
    }
  }
  async process(context: Context, student: Student, courseUUID: string, moduleUUID?: string, progress?: number): Promise<{ next: Module }> {
    await this.getEnrollment(context, student, courseUUID)
    if(moduleUUID) {
      const module = await this.courseProvider.getModule(context, courseUUID, moduleUUID)
      const [mp] = await this.learnProcessDB()
                      .where({ 
                        module: module.id, 
                        student: student.username 
                      })
      progress = progress !== undefined ? progress : module.weight
      if(!mp) {
        await this.learnProcessDB()
          .insert({ 
            progress,
            student: student.username,
            module: module.id,
            done: true
          })
      } else {
        await this.learnProcessDB()
        .update({ 
          progress,
          done: true
        })
        .where({
          module: module.id, 
          student: student.username,
        })
      }
    }
    const next = await this.toogleNextActive(context, student, moduleUUID)
    const [mps] = await this.learnProcessDB().sum(`progress as sum_of_progress`).whereIn(`module`, function(){
      this.select(`id`).from(tables.INDEX_TABLE_MODULES).whereIn(`course`, function(){
        this.select(`id`).from(tables.INDEX_TABLE_COURSES).where({ uuid: courseUUID })
      })
    })
    
    const [m] = await this.courseProvider.modulesDB().sum(`weight as sum_of_weight`).whereIn(`course`, function(){
      this.select(`id`).from(tables.INDEX_TABLE_COURSES).where({ uuid: courseUUID })
    })

    await this.enrollmentDB().update({
      progress: m[`sum_of_weight`] && (mps[`sum_of_progress`] / m[`sum_of_weight`]) || 0,
      updated: new Date()
    }).where({
      student: student.username
    }).whereIn(`course`, function(){
      this.select(`id`).from(tables.INDEX_TABLE_COURSES).where({ uuid: courseUUID })
    })
    return next
  }

  async getModuleProgress(context: Context, student: Student, courseUUID: string, moduleUUID: string): Promise<ModuleProcess> {

    const [data] = await this.learnProcessDB().select(
      `${tables.INDEX_TABLE_LEARN_PROCESS}.*`,
      `${tables.INDEX_TABLE_MODULES}.name as module_name`,
      `${tables.INDEX_TABLE_MODULES}.uuid as module_uuid`,
      `${tables.INDEX_TABLE_MODULES}.*`,
      `${tables.INDEX_TABLE_COURSES}.uuid as course_uuid`,
      `${tables.INDEX_TABLE_COURSES}.name as course_name`,
      `${tables.INDEX_TABLE_COURSES}.tutor`,
      )
    .join(tables.INDEX_TABLE_MODULES, `${tables.INDEX_TABLE_LEARN_PROCESS}.module`, '=', `${tables.INDEX_TABLE_MODULES}.id`)
    .join(tables.INDEX_TABLE_COURSES, `${tables.INDEX_TABLE_MODULES}.course`, '=', `${tables.INDEX_TABLE_COURSES}.id`)
    .where(`${tables.INDEX_TABLE_MODULES}.uuid`, moduleUUID)
    .where(`${tables.INDEX_TABLE_COURSES}.uuid`, courseUUID)
    .where(`${tables.INDEX_TABLE_LEARN_PROCESS}.student`, student.username)
    
    if(!data) throw NotFoundError(`No progress data`)
    return {
      module: {
        name: data.module_name,
        uuid: data.module_uuid
      } as Module,
      progress: data.progress,
      created: data.created,
      updated: data.updated,
      students: {
        username: data.student
      },
      active: data.active,
      done: data.done
    }
  }
  
  async fetchModuleProgress(context: Context, student: Student, courseUUID: string): Promise<ModuleProcess[]> {
    const data = await this.learnProcessDB().select(
      `${tables.INDEX_TABLE_LEARN_PROCESS}.*`,
      `${tables.INDEX_TABLE_MODULES}.name as module_name`,
      `${tables.INDEX_TABLE_MODULES}.uuid as module_uuid`,
      `${tables.INDEX_TABLE_MODULES}.*`,
      `${tables.INDEX_TABLE_COURSES}.uuid as course_uuid`,
      `${tables.INDEX_TABLE_COURSES}.name as course_name`,
      `${tables.INDEX_TABLE_COURSES}.tutor`,
      )
    .join(tables.INDEX_TABLE_MODULES, `${tables.INDEX_TABLE_LEARN_PROCESS}.module`, '=', `${tables.INDEX_TABLE_MODULES}.id`)
    .join(tables.INDEX_TABLE_COURSES, `${tables.INDEX_TABLE_MODULES}.course`, '=', `${tables.INDEX_TABLE_COURSES}.id`)
    .where(`${tables.INDEX_TABLE_COURSES}.uuid`, courseUUID)
    .where(`${tables.INDEX_TABLE_LEARN_PROCESS}.student`, student.username)
    
    if(!data) throw NotFoundError(`No progress data`)
    const r: ModuleProcess[] = []
    for (const k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        const element = data[k];
        r.push({
          module: {
            name: element.module_name,
            uuid: element.module_uuid
          } as Module,
          progress: element.progress,
          created: element.created,
          updated: element.updated,
          students: {
            username: element.student
          },
          active: element.active,
          done: element.done
        })
      }
    }
    return r
  }
  private async getHModuleProgress (context: Context, student: Student, courseUUID: string, m: HerarcialModule[]): Promise<HerarcialModuleProcess[]> {
    const p:Promise<[Error, ModuleProcess]>[] = []
    let hModule:HerarcialModuleProcess[] = []
    for (const i in m) {
      const element = m[i]
      const subModuleP = element.sub_modules && await this.getHModuleProgress(context, student, courseUUID, element.sub_modules) || null
      hModule.push({
        uuid: element.uuid,
        name: element.name,
        sub_modules: subModuleP,
        type: element.type,
        module_process: null as ModuleProcess
      })
      p.push(to(this.getModuleProgress(context, student, courseUUID, element.uuid)))
    }
    const module_processes = await Promise.all(p)
    for (const i in module_processes) {
        const [err, mP] = module_processes[i];
        hModule[i].module_process = !err && mP || null 
    }
    return hModule
  }

  async herarcialModuleProgress(context: Context, student: Student, courseUUID: string): Promise<HerarcialModuleProcess[]> {
    const hModule = await this.courseProvider.herarcialModules(context, courseUUID)
    const hModuleProcess = await this.getHModuleProgress(context, student, courseUUID, hModule)
    return hModuleProcess
  }

  private async getNextModule(context: Context, selectedModuleUUID: string, searchToParent: boolean = false): Promise<number> {
    const [m] = await this.courseProvider.modulesDB().select(`id`, `parent_module`).where(`uuid`, selectedModuleUUID).orderBy(`number`, `asc`)
    if(!m) return null

    const parentModule = m.parent_module
    if(!searchToParent) {
      const [firstModuleChildLevel] = await this.courseProvider.modulesDB().select(`id`, `parent_module`).where({ parent_module: m.id }).orderBy(`number`, `asc`)
      if(firstModuleChildLevel) return firstModuleChildLevel.id  
    }
    const modulesOnSameLevel = await this.courseProvider.modulesDB().select(`id`, `parent_module`).where({ parent_module: m.parent_module }).orderBy(`number`, `asc`)
    let next: number = null
    for (let index = 0; index < modulesOnSameLevel.length; index++) {
      const element = modulesOnSameLevel[index];
      if(element.id === m.id) {
        next = modulesOnSameLevel[index + 1] && modulesOnSameLevel[index + 1].id || null
        break
      }
    }
    if (next) return next
    if (!next && !parentModule) return null
    const [pModule] = await this.courseProvider.modulesDB().select(`uuid`).where(`id`, parentModule)
    return this.getNextModule(context, pModule.uuid, true)
  }
  private async toogleNextActive(context: Context, student: Student, moduleUUID: string): Promise<{ next: Module }> {
    const nextModuleID = await this.getNextModule(context, moduleUUID)
    if(!nextModuleID) return { next: null  }
    await this.learnProcessDB().update({
      active: true
    }).where({ 
      student: student.username
    }).whereIn(`module`, function() {
      this.select(`id`).from(`${tables.INDEX_TABLE_MODULES}`).where({ id: nextModuleID})
    })
    return { next: { module: nextModuleID } as any  }
  }

  async quizSubmit(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, answers: Answer[]): Promise<{ answers:Answer[], next: Module }> {
    const module = await this.courseProvider.getModule(context, courseUUID, moduleUUID)
    let totalPoint = 0
    let deviderPoint = 0
    let mustCheck = false
    const dataAnswer: any[] = []
    for (const key in answers) {
      const element = answers[key]
      const q = await this.courseProvider.getModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, element.question.uuid)
      let questionPoint = 0,
       questionWeight = q.weight,
       checked = false,
       isTrue = false
      if(q.type === QuestionType.MULTIPLE_CHOISE) {
        checked = true
        for (const o in q.options) {
          const option = q.options[o]
          if(option.label === element.answer && option.is_answer) {
            questionPoint = 1
            isTrue = true
          }
        }
      } else {
        mustCheck = true
      }
      dataAnswer.push({
        question: q.id,
        point: questionPoint,
        student: student.username,
        is_true: isTrue,
        answer: element.answer,
        checked
      })
      totalPoint += questionPoint * questionWeight
      deviderPoint += questionWeight
      answers[key] = {
        ...element,
        checked: checked,
        is_true: isTrue,
        point: questionPoint
      }
    }
    if(deviderPoint === 0) throw BadRequestError(`Answers required`)

    await this.quizAnswerDB().delete().where({ 
      student: student.username
    }).whereIn(`question`, function(){
      this.select(`id`)
        .from(tables.INDEX_TABLE_QUESTIONS)
        .whereIn(`quiz`, function(){
          this.select(`id`)
          .from(tables.INDEX_TABLE_QUIZ)
          .where({
            uuid: quizUUID
          })
        })
    })
    await this.quizAnswerDB().insert(dataAnswer)
    
    const moduleProgress = mustCheck ? 0 : (totalPoint / deviderPoint) * module.weight
    console.log({moduleProgress, deviderPoint, totalPoint, w: module.weight, mustCheck})
    const processed = await this.process(context, student, courseUUID, moduleUUID, moduleProgress)
    return  {...processed, answers}
  }
  async fetchAnswers(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Answer[]> {
    const r = await this.quizAnswerDB().select(
      `${tables.INDEX_TABLE_QUIZ_ANSWER}.*`,
      `${tables.INDEX_TABLE_QUESTIONS}.uuid as question_uuid`
      ).where({ 
      student: student.username
    }).join(
      `${tables.INDEX_TABLE_QUESTIONS}`, 
      `${tables.INDEX_TABLE_QUIZ_ANSWER}.question`, 
      '=', 
      `${tables.INDEX_TABLE_QUESTIONS}.id`
      ).whereIn(`${tables.INDEX_TABLE_QUESTIONS}.quiz`, function(){
        this.select(`id`)
        .from(tables.INDEX_TABLE_QUIZ)
        .where({
          uuid: quizUUID
        })
    })
    if(r.length > 0) throw NotFoundError(`No anwser with that students`)
    const answers: Answer[] = []
    for (const key in r) {
      const element = r[key];
      answers.push({
        answer: element.answer,
        checked: element.checked,
        is_true: element.is_true,
        point: element.point,
        question: {
          uuid: element.question_uuid
        } as Question,
        student
      })
    }
    return answers
  }
  async updateAnswer(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string, questionUUID: string, answer: Answer): Promise<void> {
    const question = await this.courseProvider.getModuleQuizQuestions(context, courseUUID, moduleUUID, quizUUID, questionUUID)
    await this.quizAnswerDB().update({
      is_true: answer.is_true,
      question: question.id,
      point: answer.point || 0,
      checked: answer.checked || false
    }).where({
      student: student.username,
      question: question.id
    })
    const q = await this.courseProvider.quizQuestionDB().sum(`weight as sum_of_weight`)
    const qR = await this.getQuizResult(context, student, courseUUID, moduleUUID, quizUUID)
    let sumOfPoint = 0
    for (const key in qR) {
      sumOfPoint += qR[key].point * qR[key].question.weight
    }
    const moduleProgress = sumOfPoint / q[`sum_of_weight`]
    await this.process(context, student, courseUUID, moduleUUID, moduleProgress)
  }

  async getQuizResult(context: Context, student: Student, courseUUID: string, moduleUUID: string, quizUUID: string): Promise<Answer[]> {
    const data = await this.quizAnswerDB().select(
      `${tables.INDEX_TABLE_QUIZ_ANSWER}.*`,
      `${tables.INDEX_TABLE_QUESTIONS}.uuid as question_uuid`,
      `${tables.INDEX_TABLE_QUESTIONS}.question as question`,
      `${tables.INDEX_TABLE_QUESTIONS}.weight as question_weight`,
    ).join(
      `${tables.INDEX_TABLE_QUESTIONS}`, 
      `${tables.INDEX_TABLE_QUIZ_ANSWER}.question`, 
      '=', 
      `${tables.INDEX_TABLE_QUESTIONS}.id`
      )
    .where(`${tables.INDEX_TABLE_QUIZ_ANSWER}.student`, student.username)
    .whereIn(`${tables.INDEX_TABLE_QUESTIONS}.quiz`, function(){
      this.select(`id`)
      .from(tables.INDEX_TABLE_QUIZ)
      .where({
        uuid: quizUUID
      })
    })
    const answers: Answer[] = []
    for (const key in data) {
      const element = data[key]
      answers.push({
        answer: element.answer,
        question: {
          question: element.question,
          uuid: element.question_uuid,
          weight: element.question_weight
        } as Question,
        checked: element.checked,
        is_true: element.is_true,
        point: element.point,
        student,
        created: element.created,
        updated: element.udpated
      })        
    }
    return answers
  }
}