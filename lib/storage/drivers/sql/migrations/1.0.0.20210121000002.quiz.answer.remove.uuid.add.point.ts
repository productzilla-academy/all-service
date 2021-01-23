

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUIZ_ANSWER, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('uuid')
    table.float(`point`).defaultTo(0)
    table.boolean(`is_true`).defaultTo(false)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUIZ_ANSWER, (table: Knex.CreateTableBuilder) => {
    table.string('uuid', 200).unique()
    table.dropColumn(`point`)
    table.dropColumn(`is_true`)
  })
}