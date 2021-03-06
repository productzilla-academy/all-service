

import { tables } from "../connection"
import * as Knex from 'knex'
import { ModuleType } from "../../../../../core/courses"

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_MODULES, (table: Knex.CreateTableBuilder) => {
    table.enum(`type`, [ModuleType.Module, ModuleType.Assesment]).defaultTo(ModuleType.Module)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_MODULES, (table: Knex.CreateTableBuilder) => {
    table.dropColumn(`type`)
  })
}