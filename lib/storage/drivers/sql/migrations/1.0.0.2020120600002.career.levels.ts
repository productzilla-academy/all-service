import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_LEVELS, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.string('name', 100).notNullable()
    table.text('description').notNullable()
    table.integer('number').notNullable()
    table.foreign('career').references(`${tables.INDEX_TABLE_CAREERS}.id`)
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
  })
}


export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_LEVELS);
}