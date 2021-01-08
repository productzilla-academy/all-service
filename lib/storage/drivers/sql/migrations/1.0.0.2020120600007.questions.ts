

import { tables } from "../connection"
import * as Knex from 'knex'
import { QuestionType } from '../../../../../core/courses/course.quiz.questions'
export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_QUESTIONS, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())

    table.bigInteger('quiz')
//.references(`${tables.INDEX_TABLE_QUIZ}.id`)
    table.text(`question`).notNullable()
    table.text(`answer`).nullable().defaultTo(null)
    table.enum(`type`, [QuestionType.MULTIPLE_CHOISE, QuestionType.ESSAY])
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_QUESTIONS);
}