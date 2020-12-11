import ConfigProvider from "../../../config";
import Context from "../../../context";
import CareerManager, { Career, Level } from "../../../core/careers";
import SQLConnection from "../drivers/sql/connection";
import { SQLDBProtocols } from "../storage.types";
import CareerElasticsearchProvider from "./elasticsearch/careers.elasticsearch.storage.provider";
import CareerSQLProvider from "./sql/careers.sql.storage.provider";

export class CarrerStorageProvider implements CareerManager{
  c: ConfigProvider
  hotDB: CareerManager
  coldDB: CareerManager
  
  constructor(c: ConfigProvider){
    this.c = c
    this.coldDB = SQLDBProtocols.indexOf(this.c.dsnProtocol()) ? new CareerSQLProvider(c) : null 
    this.hotDB = c.elasticsearchURL() === '' ? null : new CareerElasticsearchProvider(c)

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