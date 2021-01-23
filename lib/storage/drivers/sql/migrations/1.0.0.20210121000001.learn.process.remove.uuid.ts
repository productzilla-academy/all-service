

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_LEARN_PROCESS, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('uuid')
    table.renameColumn('process', 'progress')
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_LEARN_PROCESS, (table: Knex.CreateTableBuilder) => {
    table.string('uuid', 200).unique()
    table.renameColumn('progress', 'process')
  })
}