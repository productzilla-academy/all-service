import { Generic } from "../core.types"

export enum QuestionType {
  MULTIPLE_CHOISE = "multiple_choise",
  ESSAY = "essay"
}

export interface Options {
  label: string
  value: string
  is_answer: boolean
}

export interface Question extends Generic{
  type: QuestionType
  question: string
  answer?: string
  options?: Options[]
  weight: number
}
