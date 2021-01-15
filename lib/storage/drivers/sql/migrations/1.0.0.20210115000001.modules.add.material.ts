

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_MODULES, (table: Knex.CreateTableBuilder) => {
    table.string('material', 255).nullable()
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_MODULES, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('material')
  })
}