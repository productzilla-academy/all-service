

import { tables } from "../connection"
import * as Knex from 'knex'
export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_LEARN_PROCESS, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())
    
    table.bigInteger(`module`)
//.references(`${tables.INDEX_TABLE_MODULES}.id`)
    table.string(`student`, 255).notNullable()
    table.float(`process`).notNullable().defaultTo(0)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_LEARN_PROCESS);
}