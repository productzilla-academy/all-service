

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUESTIONS, (table: Knex.CreateTableBuilder) => {
    table.double('weight').defaultTo(1)
//.references(`${tables.INDEX_TABLE_MODULES}.id`)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.alterTable(tables.INDEX_TABLE_QUESTIONS, (table: Knex.CreateTableBuilder) => {
    table.dropColumn('weigth')
    //.references(`${tables.INDEX_TABLE_MODULES}.id`)
  })
}