import { RestRequest } from "../types"

import ConfigProvider from "../../../config";
import { Student } from "../../../core/enrollment/enroll";
import CoreManager from "../../../core/core.manager"
import { getCourseUUID } from './course'
import { getModuleUUID } from './module'
import { getQuestionUUID, getQuizUUID } from './quiz'
import { Response } from "express";
import { getFiles, getPage, getSize } from "./global";
import { Answer } from "../../../core/enrollment/quiz.result";
import { Question, QuestionType } from "../../../core/courses";
import { UploadedFile } from "express-fileupload";
import { PrecondtionError } from "../../../errors";
export const enrollmentParams = {
  student: 'student'
}
const getStudent = (r: RestRequest): Student => ({
  username: r.params[enrollmentParams.student] || r.body.student.username
})

const getAnswers = (r: RestRequest): Answer[] => {
  const answers: Answer[] = []
  if(!r.body.answers) return answers
  for (const p in r.body.answers) {
    const element = r.body.answers[p];
    answers.push({ 
      question: {
        uuid: element.question.uuid
      } as Question,
      answer: element.answer
    } as Answer)
  }
  return answers
}
const getAnswer = (r: RestRequest): Answer => {
  return {
    answer: r.body.answer,
    question: {
      uuid: r.body.question && r.body.question .uuid || getQuestionUUID(r)
    } as Question,
    checked: r.body.checked,
    is_true: r.body.is_true,
    point: r.body.point
  } as Answer
}

export const enrollmentController = (c: ConfigProvider, m: CoreManager) => ({
  async enroll(r: RestRequest, w: Response){
    await m.enrollmentManager().storage().enroll(r.context, getStudent(r), getCourseUUID(r), new Date())
    w.status(201).send({
      message: 'success'
    })
  },
  async fetchEnrollments(r: RestRequest, w: Response){
    const enrollments = await m.enrollmentManager().storage().fetchEnrollment(r.context, getStudent(r), {
      page: getPage(r),
      size: getSize(r)
    })
    w.send(enrollments)
  },
  async getEnrollment(r: RestRequest, w: Response){
    const enrollment = await m.enrollmentManager().storage().getEnrollment(r.context, getStudent(r), getCourseUUID(r))
    w.send(enrollment)
  },
  async submitModule(r: RestRequest, w: Response){
    const answers = getAnswers(r)
    if(getQuizUUID(r)) {
      const res = await m.enrollmentManager().storage().quizSubmit(r.context, getStudent(r), getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), answers)
      return w.status(202).send(res)
    }
    const res = await m.enrollmentManager().storage().process(r.context,  getStudent(r), getCourseUUID(r), getModuleUUID(r))
    w.status(202).send(res)
  },
  async getModuleProgress(r: RestRequest, w: Response){
    const mp = await m.enrollmentManager().storage().getModuleProgress(r.context, getStudent(r), getCourseUUID(r), getModuleUUID(r))
    w.send(mp)
  },
  async fetchModuleProgress(r: RestRequest, w: Response){
    const mp = await m.enrollmentManager().storage().fetchModuleProgress(r.context, getStudent(r), getCourseUUID(r))
    w.send(mp)
  },
  async herarcialModuleProgress(r: RestRequest, w: Response){
    const mp = await m.enrollmentManager().storage().herarcialModuleProgress(r.context, getStudent(r), getCourseUUID(r))
    w.send(mp)
  },
  async getQuizResult(r: RestRequest, w: Response){
    const mp = await m.enrollmentManager().storage().getQuizResult(r.context, getStudent(r), getCourseUUID(r), getModuleUUID(r), getQuizUUID(r))
    w.send(mp)
  },
  async putAnswer(r: RestRequest, w: Response){
    await m.enrollmentManager().storage().updateAnswer(r.context, getStudent(r), getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), getQuestionUUID(r), getAnswer(r) )
    w.status(202).send({
        message: 'success'
    })
  },
  async putFileAnswer(r: RestRequest, w: Response){
    const question = await m.courseManager().storage().getModuleQuizQuestions(r.context, getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), getQuestionUUID(r))
    if (question.type !== QuestionType.FILE) throw PrecondtionError(`Question type is not \`file\``)
    const f = getFiles(r) as UploadedFile
    const filename = await m.enrollmentManager().objectStorage().uploadFileAnswer(r.context, getStudent(r), getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), getQuestionUUID(r), f.data )
    w.status(202).send({
        filename
    })
  }
})
export default enrollmentController