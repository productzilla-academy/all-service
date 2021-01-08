

import { tables } from "../connection"
import * as Knex from 'knex'
export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_RESULT_CERTIFICATE, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())
    
    table.bigInteger(`course`)
//.references(`${tables.INDEX_TABLE_COURSES}.id`)
    table.double(`weight_goal`).notNullable()
    table.text(`format`).notNullable()
    table.string(`caption`, 255).notNullable()
    
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_RESULT_CERTIFICATE);
}