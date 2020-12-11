import * as knex from "knex";
import ConfigProvider from "../../../../config";
import Context from "../../../../context";
import CareerManager, { Career, Level } from "../../../../core/careers";
import SQLConnection from "../../drivers/sql/connection";

export default class CareerSQLProvider implements CareerManager {
  c: ConfigProvider
  conn: knex
  constructor(c: ConfigProvider){
    this.c = c
    this.conn = SQLConnection(c)
  }
  createCareer(context: Context, career: Career): Promise<void> {
    throw new Error("Method not implemented.");
  }
  fetchCareer(context: Context): Promise<Career[]> {
    throw new Error("Method not implemented.");
  }
  deleteCareer(context: Context, careerName: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createCareerLevel(context: Context, careerName: string, level: Level): Promise<void> {
    throw new Error("Method not implemented.");
  }
  fetchCareerLevel(context: Context, careerName: string): Promise<Level[]> {
    throw new Error("Method not implemented.");
  }
  deleteLevel(context: Context, levelUUID: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

} 