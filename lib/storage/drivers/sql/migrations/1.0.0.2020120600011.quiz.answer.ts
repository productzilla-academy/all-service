

import { tables } from "../connection"
import * as Knex from 'knex'
export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_QUIZ_ANSWER, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())
    
    table.bigInteger(`question`)
//.references(`${tables.INDEX_TABLE_QUESTIONS}.id`)
    table.string(`student`, 255).notNullable()
    table.text(`answer`).notNullable()
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_QUIZ_ANSWER)
}