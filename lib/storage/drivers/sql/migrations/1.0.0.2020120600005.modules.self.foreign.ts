
import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_MODULES, (table: Knex.CreateTableBuilder) => {
    
    table.foreign('parent_module').references(`${tables.INDEX_TABLE_MODULES}.id`)
    
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_MODULES, (table: Knex.CreateTableBuilder) => {
    table.dropForeign(['parent_module'])
    table.dropColumn(`parent_module`)    
  })
}