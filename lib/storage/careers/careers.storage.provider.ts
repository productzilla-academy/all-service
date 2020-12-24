import ConfigProvider from "../../../config";
import Context from "../../../context";
import CareerManager, { Career, Level } from "../../../core/careers";
import { SQLDBProtocols } from "../storage.types";
import CareerElasticsearchProvider from "./elasticsearch/careers.elasticsearch.storage.provider";
import CareerSQLProvider from "./sql/careers.sql.storage.provider";

export class CarrerStorageProvider implements CareerManager{
  configProvider: ConfigProvider

  hotDB: CareerManager
  coldDB: CareerManager
  
  constructor(configProvider: ConfigProvider){
    this.configProvider = configProvider
    this.coldDB = SQLDBProtocols.indexOf(this.configProvider.dsnProtocol()) ? new CareerSQLProvider(configProvider): null 
    this.hotDB = !configProvider.elasticsearchURL() ? null : new CareerElasticsearchProvider(configProvider)

  }
  async createCareer(context: Context, career: Career): Promise<void> {
    this.coldDB && await this.coldDB.createCareer(context, career)
    this.hotDB && await this.hotDB.createCareer(context, career)
  }
  async fetchCareer(context: Context): Promise<Career[]> {
    const careers = this.hotDB ? await this.hotDB.fetchCareer(context) : await this.coldDB.fetchCareer(context)
    return careers
  }
  async deleteCareer(context: Context, careerName: string): Promise<void> {
    this.coldDB && await this.coldDB.deleteCareer(context, careerName)
    this.hotDB && await this.hotDB.deleteCareer(context, careerName)
  }
  async createCareerLevel(context: Context, careerName: string, level: Level): Promise<void> {
    this.coldDB && await this.coldDB.createCareerLevel(context, careerName, level)
    this.hotDB && await this.hotDB.createCareerLevel(context,  careerName, level)
  }
  async fetchCareerLevel(context: Context, careerName: string): Promise<Level[]> {
    const levels = this.hotDB ? await this.hotDB.fetchCareerLevel(context, careerName) : await this.coldDB.fetchCareerLevel(context, careerName)
    return levels
  }
  async deleteLevel(context: Context, levelUUID: string): Promise<void> {
    this.coldDB && await this.coldDB.deleteLevel(context, levelUUID)
    this.hotDB && await this.hotDB.deleteLevel(context,  levelUUID)
  }
}