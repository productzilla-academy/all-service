import * as knex from "knex"
import ConfigProvider from "../../../../config"
import Context from "../../../../context"
import CareerManager, { Career, Level } from "../../../../core/careers"
import { DuplicateError, NotFoundError } from "../../../../errors"
import SQLConnection, { tables } from "../../../storage/drivers/sql/connection"
import {to} from 'await-to-js'
export default class CareerSQLProvider implements CareerManager {
  configProvider: ConfigProvider
  db: knex
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.db = SQLConnection(this.configProvider) 
  }
  getCareerDB(){
    return this.db(tables.INDEX_TABLE_CAREERS)
  }
  getLevelDB(){
    return SQLConnection(this.configProvider)(tables.INDEX_TABLE_LEVELS)
  }
  async getLevel(context, name: string): Promise<Career> {
    const [c] = await this.getCareerDB().where({ name })
    if(!c) throw NotFoundError(`career not found`)
    return c
  }
  async createCareer(context: Context, career: Career): Promise<void> {
    const [e] = await to(this.getLevel(context, career.name))
    if (!e) throw DuplicateError(`Career exists`)
    await this.getCareerDB().insert(career)
  }
  async fetchCareer(context: Context): Promise<Career[]> {
    const careers = await this.getCareerDB().select(`name`)
    if(!careers.length) throw NotFoundError(`Career not found`)
    return careers
  }
  async deleteCareer(context: Context, careerName: string): Promise<void> {
    await this.getCareerDB().delete().where({ name: careerName })
  }
  async createCareerLevel(context: Context, careerName: string, level: Level): Promise<void> {
    const [career] = await this.getCareerDB().where({ name: careerName })
    if(!career) throw NotFoundError(`Career not found`)
    const { id } = career as any
    await this.getLevelDB().insert({ ...level, career: id as any as Career })
  }
  async fetchCareerLevel(context: Context, careerName: string): Promise<Level[]> {
    let [career] = await this.getCareerDB().where({ name: careerName })
    if(!career) throw NotFoundError(`Career not found`)
    const { id } = career as any
    let levels = await this.getLevelDB().where({
      career: id
    })
    for (const i in levels) {
      career.id = undefined
      levels[i].id = undefined
      levels[i].career = career
    }
    if(!levels.length) throw NotFoundError(`Level not found`)
    return levels
  }
  async createLevel(context: Context, level: Level): Promise<void> {
    await this.getLevelDB().insert({ ...level})
  }
  async fetchLevel(context: Context): Promise<Level[]> {
    const levels = await this.getLevelDB().orderBy('number', 'asc')
    return levels
  }
  async deleteLevel(context: Context, levelUUID: string): Promise<void> {
    await this.getLevelDB().del().where(`name`, levelUUID)
  }
}