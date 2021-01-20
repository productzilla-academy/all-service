

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUIZ, (table: Knex.CreateTableBuilder) => {
    table.boolean('can_retry').defaultTo(true)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUIZ, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('can_retry')
  })
}