

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUIZ_ANSWER, (table: Knex.CreateTableBuilder) => {
    table.boolean(`checked`).defaultTo(false)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUIZ_ANSWER, (table: Knex.CreateTableBuilder) => {
    table.dropColumn(`checked`)
  })
}