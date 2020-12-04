import { Generic } from "../core.types";

enum QuiestionType {
  MULTIPLE_CHOISE = "multiple_choise"
}

export interface Options {
  label: string
  value: string
  isAnswer: boolean
  weight: number
}

export interface Question extends Generic{
  type: QuiestionType
  question: string
  answer: string
  options: Options
}
