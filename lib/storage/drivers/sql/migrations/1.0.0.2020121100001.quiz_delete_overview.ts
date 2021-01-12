

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUIZ, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('overview')
//.references(`${tables.INDEX_TABLE_MODULES}.id`)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUIZ, (table: Knex.CreateTableBuilder) => {
    table.text('overview')
//.references(`${tables.INDEX_TABLE_MODULES}.id`)
  })
}