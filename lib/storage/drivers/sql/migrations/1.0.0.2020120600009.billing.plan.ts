

import { tables } from "../connection"
import * as Knex from 'knex'
import { SubscriptionType } from "../../../../../core/transactions/billing"
export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_BILLING_PLANS, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())
    
    table.bigInteger(`price`).defaultTo(0)
    table.enum('subscription_type', [SubscriptionType.FREE, SubscriptionType.ONE_TIME, SubscriptionType.SUBSCRIPTION])
    table.integer('month_duration').defaultTo(0)
    table.text('courses').defaultTo('')
    table.string(`description`, 255)
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_BILLING_PLANS);
}