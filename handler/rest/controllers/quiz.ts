import { Response } from "express"
import ConfigProvider from "../../../config"
import CoreManager from "../../../core/core.manager"
import { Options, Question, QuestionType, Quiz } from "../../../core/courses"
import { RestRequest } from "../types"
import { getCourseUUID } from "./course"
import { getModuleUUID } from "./module"

export const quizParams = {
  quizUUID: 'quiz_uuid',
  questionUUID: 'question_uuid'
}

const getQuizUUID = (r: RestRequest): string => r.params[quizParams.quizUUID]

const getQuestionUUID = (r: RestRequest): string => r.params[quizParams.questionUUID]

const getQuizBody = (r: RestRequest): Quiz => ({
  description: r.body.description,
  name: r.body.name
} as Quiz)

const getQuestionBody = (r: RestRequest): Question => ({
  question: r.body.question,
  type: r.body.type || QuestionType.MULTIPLE_CHOISE,
  weight: r.body.weight
} as Question)

const getOptionsBody = (r: RestRequest): Options[] => {
  const opts = r.body
  const op: Options[] = []
  for (let i = 0; i < opts.length; i++) {
    const element = opts[i]
    op.push({
      is_answer: element.is_answer,
      label: element.label,
      value: element.value
    })
  }
  return op
}

export const quizController = (c: ConfigProvider, m: CoreManager) => ({
  async createQuiz(r: RestRequest, w: Response){
    const q = await m.courseManager().storage().createModuleQuiz(r.context, getCourseUUID(r), getModuleUUID(r), getQuizBody(r))
    w.status(201).send(q)
  },
  async updateQuiz(r: RestRequest, w: Response){
    const q = await m.courseManager().storage().updateModuleQuiz(r.context, getCourseUUID(r), getModuleUUID(r), getQuizBody(r))
    w.status(202).send(q)
  },
  async deleteQuiz(r: RestRequest, w: Response){
    const q = await m.courseManager().storage().deleteModuleQuiz(r.context, getCourseUUID(r), getModuleUUID(r))
    w.status(202).send(q)
  },
  async getQuiz(r: RestRequest, w: Response){
    const q = await m.courseManager().storage().getModuleQuiz(r.context, getCourseUUID(r), getModuleUUID(r))
    w.status(200).send(q)
  },

  async fetchQuestions(r: RestRequest, w: Response){
    const q = await m.courseManager().storage().fetchModuleQuizQuestions(r.context, getCourseUUID(r), getModuleUUID(r), getQuizUUID(r))
    w.status(200).send(q)
  },
  async createQuestions(r: RestRequest, w: Response){
    const q = await m.courseManager().storage().createModuleQuizQuestions(r.context, getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), getQuestionBody(r))
    w.status(201).send(q)
  },
  async updateQuestions(r: RestRequest, w: Response){
    const q = await m.courseManager().storage().updateModuleQuizQuestions(r.context, getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), getQuestionUUID(r), getQuestionBody(r))
    w.status(202).send(q)
  },
  async deleteQuestions(r: RestRequest, w: Response){
    const q = await m.courseManager().storage().deleteModuleQuizQuestions(r.context, getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), getQuestionUUID(r))
    w.status(202).send(q)
  },
  async getQuestions(r: RestRequest, w: Response){
    const q = await m.courseManager().storage().getModuleQuizQuestions(r.context, getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), getQuestionUUID(r))
    w.status(202).send(q)
  },

  async fetchQuizOptions(r: RestRequest, w: Response){
    const op = await m.courseManager().storage().fetchModuleQuizQuestionOptions(r.context, getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), getQuestionUUID(r))
    w.status(200).send(op)
  },
  async updateQuizOptions(r: RestRequest, w: Response){
    const op = await m.courseManager().storage().updateModuleQuizQuestionOptions(r.context, getCourseUUID(r), getModuleUUID(r), getQuizUUID(r), getQuestionUUID(r), getOptionsBody(r))
    w.status(200).send(op)
  }
})

export default quizController