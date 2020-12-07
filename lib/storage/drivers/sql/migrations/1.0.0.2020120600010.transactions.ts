

import { tables } from "../connection"
import * as Knex from 'knex'
import { SubscriptionType } from "../../../../core/transactions/billing"
import { TransactionStatus } from "../../../../core/transactions/transaction"
export const up = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.createTable(tables.INDEX_TABLE_TRANSACTIONS, (table: Knex.CreateTableBuilder) => {
    table.bigIncrements('id').primary()
    table.string('uuid', 200).unique()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.fn.now())
    
    table.json(`billing_plan`).defaultTo('{}')
    table.double('amount').defaultTo(0)
    table.string(`student`, 255).notNullable()
    table.string(`code`, 255).notNullable()
    table.string(`signature`, 255).unique().notNullable()
    table.string(`invoice`, 255).unique()
    table.enum(`status`, [TransactionStatus.PENDING, TransactionStatus.DECLINED, TransactionStatus.SUCCESS])
    
  })
}

export const down = (knex: Knex, promise: Promise<any>) => {
  return knex.schema.dropTable(tables.INDEX_TABLE_TRANSACTIONS);
}