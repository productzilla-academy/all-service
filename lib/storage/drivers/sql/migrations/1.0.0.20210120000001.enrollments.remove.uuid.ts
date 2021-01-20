

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_ENROLLMENTS, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('uuid')
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_ENROLLMENTS, (table: Knex.CreateTableBuilder) => {
    table.string('uuid', 225).unique()
  })
}