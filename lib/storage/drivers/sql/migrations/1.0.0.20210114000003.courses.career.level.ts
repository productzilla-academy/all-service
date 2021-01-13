

import { tables } from "../connection"
import * as Knex from 'knex'

export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.TABLE_REF_COURSE_CAREER_LEVEL, (table: Knex.CreateTableBuilder) => {
    table.bigInteger('course').notNullable()
    table.string('career').notNullable()
    table.string('level').notNullable()
    table.integer('number').defaultTo(0)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.TABLE_REF_COURSE_CAREER_LEVEL)
}