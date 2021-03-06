

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_LEARN_PROCESS, (table: Knex.CreateTableBuilder) => {
    table.boolean('active').defaultTo(false)
    table.boolean('done').defaultTo(false)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_LEARN_PROCESS, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('active')
    table.dropColumn('done')
  })
}