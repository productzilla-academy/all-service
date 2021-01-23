

import { tables } from "../connection"
import * as Knex from 'knex'
import { QuestionType } from "../../../../../core/courses"

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUESTIONS, (table: Knex.CreateTableBuilder) => {
    table.enum(`type`, [QuestionType.MULTIPLE_CHOISE, QuestionType.ESSAY, QuestionType.FILE]).alter()

  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUESTIONS, (table: Knex.CreateTableBuilder) => {
    table.enum(`type`, [QuestionType.MULTIPLE_CHOISE, QuestionType.ESSAY]).alter()

  })
}