

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_COURSES, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('level')
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_COURSES, (table: Knex.CreateTableBuilder) => {
    table.bigInteger('level').notNullable()
  })
}