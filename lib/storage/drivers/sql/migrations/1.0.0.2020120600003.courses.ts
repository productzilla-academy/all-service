import { tables } from "../connection"
import * as Knex from 'knex'
import { SubscriptionType } from "../../../../../core/transactions/billing"

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_COURSES, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())
    
    table.string('name', 100).notNullable()
    table.text('description').notNullable()
    table.text('overview').notNullable()
    table.string('link_path', 100).unique

    table.string('creator', 100).notNullable()
    table.foreign('level').references(`${tables.INDEX_TABLE_LEVELS}.id`)
    table.boolean('open').defaultTo(false)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_COURSES);
}