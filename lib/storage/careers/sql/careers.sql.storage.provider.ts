import * as knex from "knex";
import ConfigProvider from "../../../../config";
import Context from "../../../../context";
import CareerManager, { Career, Level } from "../../../../core/careers";
import { NotFoundError } from "../../../../errors";
import SQLConnection, { tables } from "../../drivers/sql/connection";

export default class CareerSQLProvider implements CareerManager {
  configProvider: ConfigProvider

  careerDB: knex.QueryBuilder<Career, Career[]>
  levelDB: knex.QueryBuilder<Level, Level[]>
  constructor(configProvider: ConfigProvider
){
    this.configProvider = configProvider
    this.careerDB = SQLConnection(configProvider)(tables.INDEX_TABLE_CAREERS)
    this.levelDB = SQLConnection(configProvider)(tables.INDEX_TABLE_LEVELS)
  }
  async createCareer(context: Context, career: Career): Promise<void> {
    await this.careerDB.insert(career)
  }
  async fetchCareer(context: Context): Promise<Career[]> {
    const careers = await this.careerDB
    if(!careers.length) throw NotFoundError(`Career not found`)
    return careers
  }
  async deleteCareer(context: Context, careerName: string): Promise<void> {
    await this.careerDB.delete().where({ name: careerName })
  }
  async createCareerLevel(context: Context, careerName: string, level: Level): Promise<void> {
    const [career] = await this.careerDB.where({ name: careerName })
    if(!career) throw NotFoundError(`Career not found`)
    const { id } = career as any
    await this.levelDB.insert({ ...level, career: id as any as Career })
  }
  async fetchCareerLevel(context: Context, careerName: string): Promise<Level[]> {
    const [career] = await this.careerDB.where({ name: careerName })
    if(!career) throw NotFoundError(`Career not found`)
    const { id } = career as any
    const levels = await this.levelDB.where({
      career: id
    })
    if(!levels.length) throw NotFoundError(`Level not found`)
    return levels
  }
  async deleteLevel(context: Context, levelUUID: string): Promise<void> {
    await this.levelDB.del().where(`uuid`, levelUUID)
  }
}