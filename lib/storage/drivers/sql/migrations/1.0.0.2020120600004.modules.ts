
import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_MODULES, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())
    
    table.string('name', 100).notNullable()
    table.text('description').notNullable()
    table.text('overview').notNullable()
    table.string('link_path', 100).unique

    table.foreign('course').references(`${tables.INDEX_TABLE_COURSES}.id`)
    table.text('content').notNullable()
    table.double('weight').notNullable()
    
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_MODULES);
}