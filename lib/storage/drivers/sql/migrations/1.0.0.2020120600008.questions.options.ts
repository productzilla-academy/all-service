

import { tables } from "../connection"
import * as Knex from 'knex'
export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_QUESTION_OPTIONS, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.bigInteger('question')
//.references(`${tables.INDEX_TABLE_QUESTIONS}.id`)
    table.string(`label`, 5).notNullable()
    table.text(`value`).notNullable()
    table.boolean(`is_answer`).notNullable()
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_QUESTION_OPTIONS);
}