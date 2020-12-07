

import { tables } from "../connection"
import * as Knex from 'knex'
import { SubscriptionType } from "../../../../core/transactions/billing"
import { TransactionStatus } from "../../../../core/transactions/transaction"
export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_ENROLLMENTS, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())
    
    table.json(`billing_plan`).defaultTo('{}')
    table.string(`student`, 255).notNullable()
    table.date(`open`).notNullable().defaultTo(knex.fn.now())
    table.dateTime(`expire`).nullable().defaultTo(null)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_ENROLLMENTS);
}