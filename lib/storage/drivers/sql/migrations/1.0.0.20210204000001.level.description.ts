

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_LEVELS, (table: Knex.CreateTableBuilder) => {
    table.text(`description`).defaultTo('')
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_LEVELS, (table: Knex.CreateTableBuilder) => {
    table.dropColumn(`description`)
  })
}