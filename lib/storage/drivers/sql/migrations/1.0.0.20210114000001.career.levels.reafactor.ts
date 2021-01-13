

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_LEVELS, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('uuid')
    table.dropColumn('description')
    table.dropColumn('career')
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_LEVELS, (table: Knex.CreateTableBuilder) => {
    table.string('uuid', 200).unique()
    table.text('description').notNullable()
    table.bigInteger('career').notNullable()
  })
}