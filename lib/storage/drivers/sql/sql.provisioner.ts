import Knex from 'knex'
import ConfigProvider from '../../../../config'
import Context from '../../../../context'
import { connection } from './connection'

export interface ObjectValueOf<T> {
  (key: string): T
} 

export default class SQLProvisioner {
  conn: Knex
  table: string
  config: ConfigProvider
  constructor(c: ConfigProvider, table: string) {
    this.conn = connection(c)
    this.table = table
    this.config = c
  }
  async create<T>(context: Context, object: T): Promise<T> {
    const span = this.config.traccer().startSpan(`create-${this.table}`, {childOf: context.span}).addTags({component: 'knex', object})
    let e: Error = null
    let r: T = null
    try {
      const [id] = await this.conn(this.table).insert(object).returning('id')
      const [d] = await this.conn(this.table).where({ id })
      r = d  
    } catch (err) {
      e = err
    }
    if(e) {
      span.addTags({
        error: e
      })
      context.span.finish()
    }
    context.span.finish()
    return r
  }
  async update<T>(context: Context, selector: ObjectValueOf<string>, object: T): Promise<T> {
    const span = this.config.traccer().startSpan(`update-${this.table}`, {childOf: context.span}).addTags({component: 'knex', object})
    let e: Error = null
    let r: T = null
    try {
      const updated = await this.conn(this.table).update(object).where(selector)
      if(updated === 0) {
        throw Error(`No data to update`)
      }
      const [ d ] = await this.conn(this.table).where(selector)
      r = d
    }
    catch (err) {
      e = err
    }
    if(e) {
      span.addTags({
        error: e
      })
      context.span.finish()
    }
    context.span.finish()
    return r
  }
  async delete<T>(context: Context, selector: ObjectValueOf<string>): Promise<T> {
    const span = this.config.traccer().startSpan(`update-${this.table}`, {childOf: context.span}).addTags({component: 'knex'})
    let e: Error = null
    let r: T = null
    try {
      const [ d ] = await this.conn(this.table).where(selector)
      if(!d) {
        throw Error(`No data to delete`)
      }
      await this.conn(this.table).delete().where(selector)
      r = d
    }
    catch (err) {
      e = err
    }
    if(e) {
      span.addTags({
        error: e
      })
      context.span.finish()
    }
    return r
  }
}