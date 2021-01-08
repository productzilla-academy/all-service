import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_CAREERS, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('name', 100).notNullable()
    table.text('description').nullable().defaultTo(null)
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())
  })
}


export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_CAREERS);
}